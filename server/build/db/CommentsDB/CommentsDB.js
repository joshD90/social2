"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentsDB = void 0;
const GeneralQueryGenerator_1 = require("../generalQueryGenerator/GeneralQueryGenerator");
const commentsDBQueries_1 = require("./commentsDBQueries");
class CommentsDB {
    constructor(connection) {
        this.connection = connection;
        this.commentGenericQueries = new GeneralQueryGenerator_1.GeneralQueryGenerator("comments", connection);
        this.commentVotesGenericQueries = new GeneralQueryGenerator_1.GeneralQueryGenerator("comment_votes", connection);
        this.initTables();
    }
    initTables() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connection.query(commentsDBQueries_1.commentQueryObj.initCommentsTable);
                yield this.connection.query(commentsDBQueries_1.commentQueryObj.initVotesTable);
            }
            catch (error) {
                console.log(error, "Error occuring in Initialising comment / vote tables");
            }
        });
    }
    createNewComment(comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentConnection = yield this.connection.getConnection();
            currentConnection.beginTransaction();
            try {
                const result = yield this.commentGenericQueries.createTableEntryFromPrimitives(comment);
                if (result instanceof Error)
                    throw Error(result.message);
                if (comment.inReplyTo) {
                    const updateResult = yield this.commentGenericQueries.updateEntriesByMultiple({ hasReplies: true }, comment.inReplyTo, "id");
                    if (updateResult instanceof Error)
                        throw Error("Couldn't update the parent comment");
                }
                currentConnection.commit();
                currentConnection.release();
                return result.insertId;
            }
            catch (error) {
                currentConnection.rollback();
                currentConnection.release();
                return error;
            }
        });
    }
    voteComment(vote) {
        return __awaiter(this, void 0, void 0, function* () {
            const voteValues = Object.values(vote);
            //This is to allow passing in the update value
            voteValues.push(voteValues[voteValues.length - 1]);
            console.log(voteValues);
            try {
                const [result] = yield this.connection.query(commentsDBQueries_1.commentQueryObj.voteComment, voteValues);
                if (result.affectedRows === 0)
                    throw Error("No affected rows - Nothing was changed");
            }
            catch (error) {
                return error;
            }
        });
    }
    fetchComments(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { serviceId, limit, offset, parentId, organisation } = params;
            const query = parentId
                ? commentsDBQueries_1.commentQueryObj.getReplyComments
                : commentsDBQueries_1.commentQueryObj.getParentComments;
            const values = parentId
                ? [parentId, organisation, limit, offset]
                : [serviceId, organisation, limit, offset];
            console.log(values);
            try {
                const [result] = yield this.connection.query(query, values);
                return result;
            }
            catch (error) {
                console.log(error, "error in fetchComments");
                return error;
            }
        });
    }
    deleteComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteResult = yield this.commentGenericQueries.deleteBySingleCriteria("id", id);
            if (deleteResult instanceof Error)
                return Error(deleteResult.message);
            return true;
        });
    }
    deleteVote(userId, commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.commentVotesGenericQueries.deleteByTwoCriteria(["user_id", "comment_id"], [userId, commentId]);
                if (result instanceof Error)
                    throw Error(result.message);
                return true;
            }
            catch (error) {
                return error;
            }
        });
    }
    getCommentsGeneric() {
        return this.commentGenericQueries;
    }
}
exports.CommentsDB = CommentsDB;
