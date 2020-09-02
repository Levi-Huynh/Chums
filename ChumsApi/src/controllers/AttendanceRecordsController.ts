import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { CustomBaseController } from "./CustomBaseController"
import { Answer } from "../models"

@controller("/attendancerecords")
export class AttendanceRecordController extends CustomBaseController {


}
