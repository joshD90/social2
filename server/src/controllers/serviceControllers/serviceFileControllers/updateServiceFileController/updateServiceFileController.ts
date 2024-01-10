import { Request, Response } from "express";
import { IUser } from "../../../../types/userTypes/UserType";
import { db } from "../../../../server";
import { IServiceFile } from "../../../../types/serviceTypes/ServiceType";

const updateServiceFileController = async (req: Request, res: Response) => {
  const { serviceId } = req.body;
  const user = req.user as IUser;
  if (!user || user.privileges !== "admin")
    return res
      .status(403)
      .json("Not permitted to update service without admin privileges");

  if (isNaN(serviceId)) return res.status(400).json();

  const deleteArray = await db
    .getServiceFilesDB()
    .getGenericQueries()
    .findEntryBy<IServiceFile>("service_id", serviceId);

  if (
    deleteArray instanceof Error &&
    deleteArray.message !== "Could not find any Entries matching this criteria"
  )
    throw Error(deleteArray.message);
};

export default updateServiceFileController;
