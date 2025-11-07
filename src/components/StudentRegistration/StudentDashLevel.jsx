//This dash will be used for letting students signin for level 1 result.



import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Container,
  Form,
  Button,
  Alert,
  Spinner,
  Card,
  Row,
  Col,
  CardFooter,
} from "react-bootstrap";
import Select from "react-select";
import imageCompression from "browser-image-compression";
import axios from "axios";
import { createStudent, updateStudent } from "../../services/StudentRegistrationServices/StudentRegistrationService.js";
import { FileUploadContext, StudentContext } from "../NewContextApis/StudentContextApi.js";
import { District_block_school_manual_school_name_dependentDropdown } from "../DependentDropDowns/District_block_school_dropdowns.jsx";
import { FileUpload } from "../utils/fileUploadUtils.jsx";
import { UserContext } from "../NewContextApis/UserContext.js";
import {
  DistrictBlockSchoolDependentDropDownContext,
} from "../NewContextApis/District_block_schoolsCotextApi.js";
import { AcknowledgementSlipComponent } from "./AcknowledgementSlip.jsx";


import { useLocation, useNavigate } from "react-router-dom";
import { Level1AdmitCard } from "./Level1AdmitCard.jsx";



const examControllerObject = {

 admitCardLevel1: false,
 admitCardLevel2: false,
 admitCardLevel3: false,
 resultLevel1: false,
 resultLevel2: false,
 ressultLevel3: false,
}



export const StudentDashLevelComponent = () => {


  const {studentData, setStudentData} = useContext(StudentContext)


console.log(studentData)


  return(
    <>
    
    <Container>

<Level1AdmitCard/>


    </Container>
    </>
  )


}