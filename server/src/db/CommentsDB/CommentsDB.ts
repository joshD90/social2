import {
  Pool,
  PoolConnection,
  ResultSetHeader,
  RowDataPacket,
} from "mysql2/promise";
import { GeneralQueryGenerator } from "../generalQueryGenerator/GeneralQueryGenerator";
import { commentQueryObj } from "./commentsDBQueries";
import { ICommentBase, IVote } from "../../types/commentTypes/commentTypes";
import { IGenericIterableObject } from "../../types/mySqlTypes/mySqlTypes";
import { IUser } from "../../types/userTypes/UserType";

export class CommentsDB {
  private connection: Pool;
  private commentGenericQueries: GeneralQueryGenerator;
  private commentVotesGenericQueries: GeneralQueryGenerator;

  constructor(connection: Pool) {
    this.connection = connection;
    this.commentGenericQueries = new GeneralQueryGenerator(
      "comments",
      connection
    );
    this.commentVotesGenericQueries = new GeneralQueryGenerator(
      "comment_votes",
      connection
    );
    this.initTables();
  }

  private async initTables() {
    try {
      await this.connection.query(commentQueryObj.initCommentsTable);
      await this.connection.query(commentQueryObj.initVotesTable);
    } catch (error) {
      console.log(
        error,
        "Error occuring in Initialising comment / vote tables"
      );
    }
  }

  public async createNewComment(
    comment: ICommentBase
  ): Promise<Error | number> {
    const currentConnection = await this.connection.getConnection();
    currentConnection.beginTransaction();

    try {
      const result =
        await this.commentGenericQueries.createTableEntryFromPrimitives(
          comment as unknown as IGenericIterableObject,
          currentConnection
        );

      if (comment.inReplyTo) {
        const updateResult =
          await this.commentGenericQueries.updateEntriesByMultiple(
            { hasReplies: true },
            comment.inReplyTo,
            "id",
            currentConnection
          );
        if (updateResult.affectedRows === 0)
          throw Error("Could not update comment");
      }
      currentConnection.commit();
      currentConnection.release();
      return result.insertId;
    } catch (error) {
      currentConnection.rollback();
      currentConnection.release();
      return error as Error;
    }
  }

  public async voteComment(vote: IVote) {
    const voteValues = Object.values(vote);
    //This is to allow passing in the update value TODO: Figure out why I put this in and comment it correctly
    voteValues.push(voteValues[voteValues.length - 1]);

    try {
      const [result] = await this.connection.query<ResultSetHeader>(
        commentQueryObj.voteComment,
        voteValues
      );
      if (result.affectedRows === 0)
        throw Error("No affected rows - Nothing was changed");
    } catch (error) {
      return error as Error;
    }
  }

  public async fetchComments(params: {
    organisation: string;
    serviceId: number;
    limit: number;
    offset: number;
    parentId?: number;
  }): Promise<RowDataPacket[] | Error> {
    const { serviceId, limit, offset, parentId, organisation } = params;

    const query = parentId
      ? commentQueryObj.getReplyComments
      : commentQueryObj.getParentComments;
    const values = parentId
      ? [parentId, organisation, limit, offset]
      : [serviceId, organisation, limit, offset];

    try {
      const [result] = await this.connection.query<RowDataPacket[]>(
        query,
        values
      );

      return result;
    } catch (error) {
      return error as Error;
    }
  }

  public async deleteComment(
    id: number,
    currentConnection: PoolConnection
  ): Promise<ResultSetHeader> {
    const deleteResult =
      await this.commentGenericQueries.deleteBySingleCriteria(
        "id",
        id,
        currentConnection
      );

    return deleteResult;
  }

  public async deleteVote(
    userId: number,
    commentId: number
  ): Promise<boolean | Error> {
    const currentConnection = await this.connection.getConnection();

    try {
      currentConnection.beginTransaction();
      await this.commentVotesGenericQueries.deleteByTwoCriteria(
        ["user_id", "comment_id"],
        [userId, commentId],
        currentConnection
      );
      currentConnection.commit();
      currentConnection.release();
      return true;
    } catch (error) {
      currentConnection.rollback();
      currentConnection.release();
      return error as Error;
    }
  }

  public async updateComment(
    comment: ICommentBase,
    user: IUser,
    currentConnection: PoolConnection
  ) {
    if (!comment.id || !user.id) throw Error("Needs a comment.id and a userId");
    const currentTime = new Date().toISOString().slice(0, 19).replace("T", " ");
    const result = await this.commentGenericQueries.updateEntriesByMultiple(
      {
        comment: comment.comment,
        updated_at: currentTime,
        updated_by_id: user.id,
      },
      comment.id,
      "id",
      currentConnection
    );
    if (result.affectedRows === 0) throw Error("Could not update comment");
    return result;
  }

  public getCommentsGeneric(): GeneralQueryGenerator {
    return this.commentGenericQueries;
  }
}
