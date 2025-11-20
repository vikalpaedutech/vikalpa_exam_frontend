import './App.css';
import RegistrationForm from './components/RegistrationFormComponent';
import InputSrn from './components/InputSrn'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistrationFormPutComponent from './components/RegistrationFormPutComponent';
import DependentDropComponent from './components/DependentDropComponent';
import SearchableDropdown from './components/custdrop';
import UserSignUp from './components/UserSignup'
import UserSignIn from './components/UserSignIn';
import UserPage from './components/UserPage';
import BulkUpload from './components/BulkUpload';
// import UserProvider from './components/ContextApi/UserContextAPI/UserContext';
import RegistrationFormComponent from './components/RegistrationFormComponent';
import LandingPage from './pages/LandingPage'
import RegistrationPage from './pages/RegistrationPage';
import BulkUploadWithDistBC from './components/BulkUploadWithDistBC';
import StudentProvider from './components/ContextApi/StudentContextAPI/StudentContext';
import AcknowledgementSlip from './components/AcknowledgementSlip';
import StudentSignIn from './components/StudentSignIn';
import StudentPage from './components/StudentPage';
import RegistrationDashComponent from './components/RegistrationDashComponent';
import UserRegistrationPageMB from './pages/UserRegistrationPageMB';
import UserRegistrationPage100 from './pages/UserRegistrationPage100';
import UserDash from './components/UserDash'
import UserDash8 from './components/UserDash';
import DistrictBlockDash8 from './components/DistrictBlockDash8';
import DistrictBlockDash10 from './components/DistrictBlockDash10';
import BlockSchoolDash8 from './components/BlockSchoolDash8';
import BlockSchoolDash10 from './components/BlockSchoolDash10';
import SchoolDash8 from './components/SchoolDash8';
import SchoolDash10 from './components/SchoolDash10';
import DashBoardPage from './pages/DashBoardPage';
import Verification from './components/Verification';
import Attendance10 from './components/Attendance10';

//Manual entry route
import Manualentry from './components/Manualentry';

import ManualFormEntry from './components/ManualFormEntry';
import ManualEntryInputSrn from './components/ManualEntryInputSrn';

//Admit card
import AdmitCard from './components/AdmitCard';

import DistrictDash8 from './components/DistrictDash8';

//Attendance sheet
import Attendance8 from './components/Attendance8';

import { MBL3Attendance } from './components/Attendance/MBL3Attendance';
import { Super100L2Attendance } from './components/Attendance/Super100Attendance';
import { Super100L2AttendanceFemale } from './components/Attendance/Super100AttendanceFemale';


//For anual merit
import StudentSignInAME from './components/StudentSigninAME';
import StudentPageAme from "./components/StudentPageAme";
import AttendanceAME from './components/AttendanceAME';
import { AMEL3Attendance } from './components/Attendance/AMEL3Attendance';
import IdCardS100 from "./components/Super100/IdCard";
import IdCardS100SelectAndDownload from './components/Super100/SelectAndDownloadIdCard';
import { Mbprecounselling } from './components/counselling/Mbprecounselling';
import { CounsellingAttendance } from './components/counselling/CounsellingAttendance';
import { CounsellingDocumentation } from './components/counselling/CounsellingDocumentation';
import { CounsellingDash } from './components/counselling/CounsellingDash';


import { PrincipalSchoolsAbrcDataCollection } from './components/CallingNDataCollection/PrincipalSchoolsAbrcDataCollection';
import { UpdatePrincipalSchoolsAbrcData } from './components/CallingNDataCollection/UpdatePrincipalSchoolsAbrcDataCollection';




//New imports
import {
  DistrictBlockSchoolProvider,
  BlockProvider,
  SchoolProvider,
  ClassOfStudentProvider,
  DistrictProvider,
  DistrictBlockSchoolDependentDropDownContext,
  DistrictBlockSchoolDependentDropDownProvider,
} from "./components/NewContextApis/District_block_schoolsCotextApi.js";



import { StudentRegistrationForm } from './components/StudentRegistration/StudentRegistrationForm';
import { UserSignin } from './components/UserComponent/UserSignin.jsx';
import { UserCreationForm } from './components/UserComponent/AdminUserCreationForm.jsx';
import { UserProvider } from './components/NewContextApis/UserContext.js';
import { UserSignup } from './components/UserComponent/UserSignup.jsx';
import { StudentProviderV1 } from './components/NewContextApis/StudentContextApi.js';
import { FileUploadProvider } from './components/NewContextApis/StudentContextApi.js';
import { StudentSignin } from './components/StudentRegistration/StudentSignin.jsx';
import { DateContextProvider } from './components/NewContextApis/DateContextApi.js';
import { AcknowledgementSlipComponent } from './components/StudentRegistration/AcknowledgementSlip.jsx';
import { UserDashBoard } from './components/UserComponent/UserDash.jsx';
import { MainNavBar } from './components/NavbarsAndFooters/MainNavBar.jsx';
import { MainFooter } from './components/NavbarsAndFooters/MainFooter.jsx';
import { UserLayout } from './components/NavbarsAndFooters/UserNavbarLayout.jsx';
import { BulkRegistrations } from './components/UserComponent/BulkRegistration.jsx';
import { StudentLayout } from './components/NavbarsAndFooters/StudentNavbarLayout.jsx';
import { UserLoginForFormVerification } from './components/UserComponent/UserLoginForFormVerification.jsx';
import { StudentFormVerification } from './components/UserComponent/StudentFormVerification.jsx';
import { RegisteredStudentsByUsers } from './components/UserComponent/RegisteredStudentsByUsers.jsx';
import { Districtdashboard, Districtdashboard8 } from './components/Dashboards/DistrictDashboard8.jsx';
import Districtdashboard10 from './components/Dashboards/DistrictDashboard10.jsx';
import { BlockSchoolDashboard8 } from './components/Dashboards/BlockDashboard8.jsx';
import { BlockSchoolDashboard10 } from './components/Dashboards/BlockDashboard10.jsx';
import { DashboardLandingPage } from './components/Dashboards/DashBoardLandingPage.jsx';
import { StudentDashLevelComponent } from './components/StudentRegistration/StudentDashLevel.jsx';
import BulkDownloadProvider from './components/ContextApi/BulkDownloadAPI/BulkAdmitCardDownloadContextApi.js';
import { SchoolDashboard } from './components/Dashboards/SchoolDashboard.jsx';
import { BLCStudentSignatureForm } from './components/StudentRegistration/BLCStudentSignatureForm.jsx';
import { PrincipalAbrcBeoDeoCalling } from './components/UserComponent/PrincipalAbrcBeoDeoCallings.jsx';
import {PrincipalCallings} from './components/UserComponent/PrincipalCallings.jsx';
import { AbrcCallings } from './components/UserComponent/AbrcCalling.jsx';
import { BeoCallings } from './components/UserComponent/BeoCalling.jsx';
import { DeoCallings } from './components/UserComponent/DeoCalling.jsx';
import { AdminDash } from './components/UserComponent/AdminDash.jsx';
import { BulkStudentFormVerification } from './components/UserComponent/BulkStudentFromVerification.jsx';
function App() {


  return (
    <div className="app-root">

      
      
       
    <Router>
 <MainNavBar/>
 
      {/* MainNavbar */}
      
      
      <BulkDownloadProvider>
      <FileUploadProvider>
      <DistrictBlockSchoolDependentDropDownProvider>
      <DistrictBlockSchoolProvider>
            <DistrictProvider>
            <BlockProvider>
              <SchoolProvider>
      
        <StudentProvider>
          <StudentProviderV1>
        <UserProvider>
          <DateContextProvider>
        <Routes>

                <Route path="/" element={<LandingPage />} />  


                

                <Route path="/srn" element={<InputSrn />} />
                <Route path="/srn-100-deactivated" element={<InputSrn />} />


                {/* below are the self links */}
                <Route path="/Registration-form/MB" element={<RegistrationFormComponent />} />
                <Route path="/Registration-form/put/MB-deactivated" element={<RegistrationFormPutComponent />} />
                <Route path="/Registration-form/S100-deactivated" element={<RegistrationForm />} />
                <Route path="/Registration-form/put/S100-deactivated" element={<RegistrationFormPutComponent />} />

                <Route path='/Registration-dash' element = {<RegistrationDashComponent/>}/>
                
                <Route path="/dependent" element ={<DependentDropComponent/>}/>
            
                <Route path="/searchable" element = {<SearchableDropdown/>}/>

                {/* Below routes are for users */}

                <Route path='/user-signup-deactivated' element = {<UserSignUp/>}/>
                <Route path = '/user-signin' element = {<UserSignIn/>}/>
                <Route path = '/user-page' element = {<UserPage/>}/>

                <Route path="/user-srn" element = {<InputSrn/>}/>
                <Route path = '/userprofile' element = {<UserPage/>}/>

                <Route path="/user-Registration-form/MB-deactivated" element={<RegistrationForm />} />
                <Route path="/user-Registration-form/put/MB-deactivated" element={<RegistrationFormPutComponent />} />

                <Route path='/userprofile/registration-mb-deactivated' element ={<UserRegistrationPageMB/>}/> 
                <Route path='/userprofile/registration-100-deactivated' element ={<UserRegistrationPage100/>}/>

                  {/* BulkUpload */}

                  <Route path="/Bulkupload" element={<BulkUpload />} />
                  <Route path="/userprofile/bulkregister-mb-deactivated" element={<BulkUploadWithDistBC />} />
                  <Route path="/userprofile/bulkregister-100-deactivated" element={<BulkUploadWithDistBC />} />  


                  
                  {/*                   
                  <Route path="/contextsignin" element={<UserState />} />
                  <Route path="/usernewpage" element={<UserNewPage />} /> */}
                  <Route path = "/Registration-page" element ={<RegistrationPage/>}/>
                  <Route path = "/Acknowledgement" element = {<AcknowledgementSlip/>}/>

                  {/* StudentLogin page and Student Account */}

                  <Route path='/student-signin' element = {<StudentSignIn/>}/>

                  <Route path='/student-signin-s100-deactivated-deactiveateddlskfjlk' element = {<StudentSignIn/>}/>
                  <Route path = '/Student-dash' element = {<StudentPage/>}/>

                  {/* Dashboard routes below */}
                  <Route path='/User-dash' element = {<UserDash8/>}/>

                  {/* Acknowledgement slip routes for mb and 100 */}
                  <Route path='/acknowledgementslip-mb' element = {<AcknowledgementSlip/>}/>
                  <Route path='/acknowledgementslip-100' element = {<AcknowledgementSlip/>}/>



                  {/* Dasdhboar routes */}
                  <Route path = '/examination/dashboard' element = {<DashBoardPage/>}/>
                  <Route path='/userprofile/dashboard-mb' element = {<UserDash/>}/>
                  <Route path='/userprofile/dashboard-100' element = {<UserDash/>}/>
                  <Route path='/districtblockdash-mb' element = {<DistrictBlockDash8/>}/>
                  <Route path = '/districtblockdash-100' element = {<DistrictBlockDash10/>}/>
                  <Route path = '/blockschooldash-mb' element = {<BlockSchoolDash8/>}/>
                  <Route path='/blockschooldash-100' element = {<BlockSchoolDash10/>}/>
                  <Route path = '/schooldash-mb' element = {<SchoolDash8/>}/>
                  <Route path = '/schooldash-100' element = {<SchoolDash10/>}/>
                  <Route path = '/districtdash-mb' element = {<DistrictDash8/>}/>


                    {/* Routes for verifcation portal */}

                    <Route path='/verification-deactivated' element = {<Verification/>}/>
                    

                    {/* Using Same form component for manual entry by users where aadahr will be optional */}
                    {/* Manual entry route */}
                    <Route path='/manualentry-deactivated' element = {<Manualentry/>}/>
                    <Route path='/manualentryinputsrn-deactivated' element ={<ManualEntryInputSrn/>}/>
                    <Route path='/manualformentry-deactivated' element = {<ManualFormEntry/>}/>


                    {/* admit card route */}

                    <Route path='/admitcard' element = {<AdmitCard/>}/>  

                    {/* https://registration.buniyaadhry.com/student-signin-s100 */}

                    {/* Attendance sheet routes */}
                    <Route path='/pratibhakhoj-attendance/mb' element = {<Attendance8/>}/>
                    <Route path='/mark-attendance-mb' element = {<MBL3Attendance/>}/>
                    <Route path='/mark-attendance-s100-boys' element = {<Super100L2Attendance/>}/>
                    <Route path='/mark-attendance-s100-girls' element = {<Super100L2AttendanceFemale/>}/>
                    <Route path='/mark-attendance-ame' element = {<AMEL3Attendance/>}/>

                    
                    <Route path='/pratibhakhoj-attendance/s100' element = {<Attendance10/>}/>


                    {/* Route for anuual merit admit card. Temporary for batch 2024-26 */}
                    <Route path='/download-ame-admitcard' element = {<StudentSignInAME/>}/>
                    <Route path='/student-dash-ame' element = {<StudentPageAme/>}/>
                    <Route path='/attendance-ame' element = {<AttendanceAME/>}/>
                    <Route path='/id-card-s100' element = {<IdCardS100/>}/>
                    <Route path='/id-card-s100-select' element = {<IdCardS100SelectAndDownload/>}/>

                    {/* Counselling Routes */}
                    <Route path='/counselling-mb' element = {<Mbprecounselling/>}/>
                    <Route path='/counselling-attendance' element = {<CounsellingAttendance/>}/>
                    <Route path='/counselling-documentation' element = {<CounsellingDocumentation/>}/>
                    <Route path='/counselling-dashboard' element = {<CounsellingDash/>}/>





                      {/* newroutes */}

                      {/* user related routes */}
                      
                      {/* <Route path='/exam-user-signin' element = {<UserSignin/>}/>

                      <Route path='/exam-user-signup' element = {<UserSignup/>}/>

                      <Route path='/exam-user-dash' element = {<UserDashBoard/>}/> */}


                        
                    {/* PricnipalSchoolsAbrcDataCollerction */}
                     
                      <Route path='/update-principal-schools-abrc-data' element = {<UpdatePrincipalSchoolsAbrcData/>}/>



                        <Route path="/exam-user-signin" element={<UserSignin />} />
                          <Route path="/exam-user-signup" element={<UserSignup />} />
                          <Route element={< UserLayout/>}>
                          
                          <Route path="/exam-user-dash" element={<UserDashBoard />} />
                          <Route path="/user-registration-form-mb" element={<StudentRegistrationForm />} />
                          <Route path="/user-registration-form-sh" element={<StudentRegistrationForm />} />

                            <Route path="/user-student-signin-mb" element={<StudentSignin />} />
                            <Route path="/user-student-signin-sh" element={<StudentSignin />} />
                             <Route path="/user-bulk-registrations" element={<BulkRegistrations />} />

                             <Route path="/user-registered-students-mb" element={<RegisteredStudentsByUsers />} />
                             <Route path="/user-registered-students-sh" element={<RegisteredStudentsByUsers />} />


                              <Route path="/user-exam-acknowledgement-slip-mb" element={<AcknowledgementSlipComponent />} />
                              <Route path="/user-exam-acknowledgement-slip-sh" element={<AcknowledgementSlipComponent />} />


                              <Route path='/principal-abrc-data' element = {<PrincipalSchoolsAbrcDataCollection/>}/>


                                {/*  callings routes */}




                         <Route path='/callings' element = {<PrincipalAbrcBeoDeoCalling/>}/>



                         <Route path='/callings-principals' element = {<PrincipalCallings/>}/>

                        
                         <Route path='/callings-abrc' element = {<AbrcCallings/>}/>


                          <Route path='/callings-beo' element = {<BeoCallings/>}/>


                           <Route path='/callings-deo' element = {<DeoCallings/>}/>




                        </Route>




                      {/* admin related routes */}    {/* Admin routes */}
                      <Route path='/admin-user-creation' element = {<UserCreationForm/>}/>

                            <Route path='/admin' element = {<AdminDash/>}/>
                      

                      {/* student related registration routes */}
                      <Route element = {<StudentLayout/>}>
                        <Route path="/exam-registration-form-mb" element={<StudentRegistrationForm />} />
                      <Route path="/exam-registration-form-sh" element={<StudentRegistrationForm />} />
                       <Route path="/exam-student-signin-mb" element={<StudentSignin />} />
                       <Route path="/exam-student-signin-sh" element={<StudentSignin />} />

                        <Route path='/student-login-dash' element={<StudentDashLevelComponent/>}/>

                      </Route>
                  
                        <Route path="/exam-acknowledgement-slip-mb" element={<AcknowledgementSlipComponent />} />
                      <Route path="/exam-acknowledgement-slip-sh" element={<AcknowledgementSlipComponent />} />


                        {/* Form verification routes */}
                        <Route path="/verification-signin" element={<UserLoginForFormVerification />} />
                          <Route path="/student-form-verification" element={<StudentFormVerification />} />

                          <Route path="/Bulk-student-form-verification" element={<BulkStudentFormVerification />} />





                            {/* dashboard routes */}

                             <Route path="/district-block-mb" element={<Districtdashboard8 />} />
                            <Route path="/district-block-sh" element={<Districtdashboard10 />} />

                            <Route path="/block-school-mb" element={<BlockSchoolDashboard8 />} />

                            <Route path="/block-school-sh" element={<BlockSchoolDashboard10 />} />

                            <Route path="/school-dashboard-mb" element={<SchoolDashboard />} />

                            <Route path="/school-dashboard-sh" element={<SchoolDashboard />} />

                           <Route path="/exam-dashboard" element={<DashboardLandingPage />} />


                            {/* Admit card routes */}

                            {/* <Route path='/admit-card-level-1' element = {}/> */}

                            <Route path='/blc-student-signature-form' element = {<BLCStudentSignatureForm/>}/>

                          




                          


            </Routes>
            </DateContextProvider>
            </UserProvider>
            </StudentProviderV1>
            </StudentProvider>
            
          
            </SchoolProvider>
            </BlockProvider>
            </DistrictProvider>
          </DistrictBlockSchoolProvider>
            </DistrictBlockSchoolDependentDropDownProvider>

            </FileUploadProvider>
            </BulkDownloadProvider>
            <MainFooter/>
        </Router>
        
        
        
        </div>
  );
}


export default App;




