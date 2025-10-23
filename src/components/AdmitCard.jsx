//This component will have the admit card for Level 1, 2, 3.
import React, {useState, useEffect, useContext,useRef} from 'react';
import {Card, Button} from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'

//Importing student context api
import { StudentContext } from './ContextApi/StudentContextAPI/StudentContext';
import registrationServiceInstance from '../services/RegistrationFormService';





export default function AdmitCard (studentfromUserDash) {


    

    // const hasRun = useRef(false);  // Keeps track of if the effect has already run.

    // useEffect(() => {
    //     if (Object.keys(studentfromUserDash).length > 0 && !hasRun.current) {
    //         hasRun.current = true;  // Mark that the effect has run.
    //         console.log('i am inside useEffect');
    //         console.log(studentfromUserDash);
    //         // Uncomment this line to trigger DownloadAdmitCard if needed.
    //          DownloadAdmitCard();
    //     } else {
    //         console.log('Length of student context is 0 or effect has already run');
    //     }
    // }, [studentfromUserDash]); // This will trigger the effect when `studentfromUserDash` changes.

    //____________________________________________________________________

    let admitCard1;
    let admitCard2;
    let admitCard3;
    //Below variables controls the level of admit card.
    const levelofAdmitCard = "Level2"
    const admitcardLevelMB = levelofAdmitCard
    // level2, level3 dynamnically changes admitcardLevel

    
    

    const {student} = useContext(StudentContext);
 const {setStudent} = useContext(StudentContext); 

    if (student.rollNumber === ""){
        alert('Admit card will be available for download in 2 days. Please check back then. (एडमिट कार्ड 2 दिन में डाउनलोड के लिए उपलब्ध होगा।')
        return;
    } else  {

    }

//  console.log(' i am student context')
//  console.log(student)
    //below logic handles admit card level and examType(mb or s100 dynamically)
// console.log(studentfromUserDash)
    
if (Object.keys(studentfromUserDash).length !== 0 ){
    DownloadAdmitCard();

}

//  DownloadAdmitCard();
    async function DownloadAdmitCard () {

        console.log('I AM INSIDE ')
        console.log(student.isL3AdmitCardActive)
        if (student.finalShortListOrWaitListStudents === ""){
            alert("Dear Student your admit card will be available for downloading soon! (प्रिय छात्र, आपका प्रवेश पत्र जल्द ही डाउनलोड के लिए उपलब्ध होगा!)")
            return;
        }

        console.log('i got clicked')
        console.log('i am inside admit card and below came from user dash')
        console.log(student)
        console.log(student.grade)
        //Below logic handles the mb admit card

        if (student.grade === "8" && admitcardLevelMB === "Level2") {

            console.log('i am student id')
        console.log(student._id)

        
         //Below var updates the admit card downloading status in the mongodb on the basis of student _id

            

         const admitCard1 = true
         const admitCard2 =  true
         const admitCard3 = true
         const id = student._id
         //_________________________________________   

      

        const pdf = new jsPDF("p", "mm", "a4");


       

        const admitHrLogo = "/admitHrLogo.png"
        const buniyaadLogo = "/admitBuniyaLogo.png"

        //all the header images
        const pratibhaKhoj = "/pratibhakhoj.png"
        const Name = "/Name.png"
        const Father = "/hindiFather.png"
        const DOB = "/DOB.png"
        const Category = "/Category.png"
        const Srn = "/SRN.png"
        const RollNumber = "/hindiRollnumber.png"
        const Aadhar = "/hindiAadhar.png"
        const Mobile = "/hindiMobile.png"
        const District = "/District.png"
        const Block = "/Block.png"
        const ParikshaKendra = "/hindiParikshakendra.png"
        const AdmitInstructions = "/admitinstructionsLevel3.png"
        const AdmitInstructionsCounselling = '/counsellingInstructions.png'
    
        const StudentSignature = "/studentsignature.png"
        const VikalpaStamp = "/vikalpaStamp.png"
        
        //pdf header image

        pdf.addImage(pratibhaKhoj, "PNG",  95, 15, 18, 6 );

        //Add logo hrLogo to the left side:
        pdf.addImage(admitHrLogo, "PNG", 10, 5, 20, 20)
        pdf.addImage(buniyaadLogo, "PNG", 180, 5, 20, 20)

     
         pdf.addImage(AdmitInstructionsCounselling, "PNG", 5,135,198,135)
         pdf.addImage(StudentSignature, "PNG", 5, 280, 198, 5)
         pdf.addImage(VikalpaStamp, "PNG", 168, 263, 25, 23)

    
        pdf.setFontSize(10);
        pdf.text('E-Admit Card', 105, 10, {align:'center'})
        pdf.setFontSize(12);
        pdf.text('Directorate of School Education (DSE) Shiksha Sadan, Haryana', 105, 15, {align: "center"})

      
        // pdf.setFontSize(8)
        // pdf.text('Pratibha Khoj hind', 100, 20)
        // for exam type:

        //below var is to show dynmaic exam type in admit card
        let examtype
        if (student.grade === "8") {
            examtype = "Mission Buniyaad"
        } else { examtype = "Haryana Super 100"}

        pdf.setFontSize(14);
        pdf.text(examtype, 105, 25, {align:'center'})
        pdf.setFontSize(10);
        if (admitcardLevelMB === "Level1"){
            pdf.text('Level-1 Entrance Exam (2025-27)', 105, 30, {align:'center'})
        } else if (admitcardLevelMB === "Level2") {
            pdf.text('Counselling Session (2025-27)', 105, 30, {align:'center'})
        }
       

        //for examination date
        pdf.setFont("helvetica", "bold")
        pdf.setFontSize(12);
        pdf.text(`Couselling Date: ${student.counsellingDate}`, 105, 35,{align:'center'})
        
        // if (student.L1blockAdmitCard === "Panchkula (16)"){
        //     reportingTime = "07:30 AM"
        // } else {
        //     reportingTime = "08:30 AM"
        // }


        
        if (student.finalShortListOrWaitListStudents === "Selected"){
            pdf.setFont("helvetica", "bold")
            pdf.setFontSize(12);
            pdf.text(`Reporting Time: 8:00 AM - 12:00 PM, (Batch-1)`, 105, 40, {align:"center"})

        } else {
            pdf.setFont("helvetica", "bold")
            pdf.setFontSize(12);
            pdf.text(`Reporting Time: 12:00 PM - 02:30 PM, (Batch-2)`, 105, 40, {align:"center"})

        }
        

        console.log(' i am just before formateDATE')

        //Changind date format to dd-mm-yyyy from db
        const formatDate = (dob) => {
            const [year, month, day] = dob.split("-"); // Split the string into year, month, and day
            return `${day}-${month}-${year}`; // Rearrange and join them in dd-mm-yyyy format
          };

        //________________________________________________________

   
        
          // Table data
          const rows = [
            ["Name", student.name.toUpperCase()],
            ["Father's Name", student.father.toUpperCase()],
            ["Date of Birth", formatDate(student.dob)],
            ["Category", student.category.toUpperCase()],
            ["SRN", student.srn],
            ["Exam Roll Number", student.rollNumber],
            ["Aadhar Number", student.aadhar],
            ["Mobile Number", student.mobile],
            ["District/Code", student.L1districtAdmitCard.toUpperCase()],
            ["Block/Code", student.L1blockAdmitCard.toUpperCase()],
            ["Counselling Center", student.counsellingVenue.toUpperCase()],
            ["Result Status", student.finalShortListOrWaitListStudents.toUpperCase()] // Added Room Number
        ];
        
        // Generate table
        autoTable(pdf, {
            body: rows,
            startY: 43, // Adjust starting Y position
            styles: {
                fillColor: null, // No background color for rows
                textColor: 0, // Black text color
                tableLineColor: [0, 0, 0],
                lineWidth: 0.5, // Set border line width
                lineColor: 0,
                halign: 'left', // Align text to the left
                valign: 'middle', // Vertically align text in the middle
            },
            headStyles: {
                fillColor: null, // No background color for header
                textColor: 0, // Black text color for header
                tableLineColor: [0, 0, 0],
                fontStyle: 'normal', // Normal font for header
                lineWidth: 0.5, // Set border line width for header
            },
            alternateRowStyles: {
                fillColor: null, // Remove alternating row background
            },
            columnStyles: {
                0: { cellWidth: 50 }, // Column 1 width
                1: { cellWidth: 100 }, // Column 2 width
            },
        });

       

        const photoText = `If no photograph
        is available, attach a 
        passport-sized photo attested 
        by the school..`

        if (student.image === null || student.image === "" || student.imageUrl === "" || !student.image || !student.imageUrl ) {

        
      
        pdf.setFontSize(8);
        pdf.text(photoText, 182, 55,{align:'center'})


            pdf.rect(166, 42.5, 38,38)

        } else  {
            

            //Some people uploaded pdf file for the student images, so below logic handles that.
            if(student.imageUrl.slice(-3) === "pdf") {
                pdf.setFontSize(8);
                pdf.text(photoText, 182, 55,{align:'center'})
                pdf.rect(166, 42.5, 38,38)
            }else{pdf.addImage(student.imageUrl, "PNG", 166, 42.5, 38, 38);}

            
        }
        
        //Save pdf
        pdf.save(`${student.name}_${student.srn}_Admit-Card.pdf`)


        
        //below const updates the resultStatus1 that tells us that student has checked...
        // his or her result on portal.
        //Logic of this is, i am assuming if student downlods his/her admit card or...
        //level 1 qualifying certificate then we update the resultStatus1 field in ...
        //mongoDB to True.
        const resultStatus2 = true; 
        //^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^  
        
        const gradeForDynamicallyUpdatingResultStatusInDb =8
        //Below api updates the admitCard1 status to true if the card is downloaded
        //Below api handles the admit card according to the level of exam.
        const formData = new FormData ();
        // if (admitcardLevelMB === "Level1") {
        //     formData.append("admitCard1", admitCard1)
        // } else if (admitcardLevelMB === "Level2") {
        //     formData.append("admitCard3", admitCard3)
        // }
        formData.append("admitCard3", admitCard3)
        formData.append("resultStatus2", resultStatus2)


        try {

            const response = await registrationServiceInstance.patchDownloadAdmitCardById(
                id,
                formData,
                gradeForDynamicallyUpdatingResultStatusInDb,
                
            )

            console.log('Admit card downloaded')
            
        } catch (error) {
            console.error("Error Downloading Admit Card:", error);
            
        }


        //if block ends here
        
        }

        //come here at super 100
        // below else if block is for super 100
        else if (student.grade === "10" ) {
            //below code generates super 100 admit card


            // console.log('i am student id')
            // console.log(student._id)
    
            
             //Below var updates the admit card downloading status in the mongodb on the basis of student _id
    
                
                //Activate or deactivate below const admitCard1 to send the boolean stamp in db
             const admitCard1 = true
             const id = student._id
             //_________________________________________   
    
            // console.log('i am download admit card function')
    
            const pdf = new jsPDF("p", "mm", "a4");
    
    
        //    console.log('i am before logo hr')
    
            const admitHrLogo = "/admitHrLogo.png"
            const buniyaadLogo = "/admitBuniyaLogo.png"
    
            //all the header images
            const pratibhaKhoj = "/pratibhakhoj.png"
            const Name = "/Name.png"
            const Father = "/hindiFather.png"
            const DOB = "/DOB.png"
            const Category = "/Category.png"
            const Srn = "/SRN.png"
            const RollNumber = "/hindiRollnumber.png"
            const Aadhar = "/hindiAadhar.png"
            const Mobile = "/hindiMobile.png"
            const District = "/District.png"
            const Block = "/Block.png"
            const ParikshaKendra = "/hindiParikshakendra.png"
            const AdmitInstructions = "/s-100admitinstructionsLevel2.png"
            const StudentSignature = "/studentsignature.png"
            const VikalpaStamp = "/vikalpaStamp.png"
            
            //pdf header image
    
            pdf.addImage(pratibhaKhoj, "PNG",  95, 15, 18, 6 );
    
            //Add logo hrLogo to the left side:
            pdf.addImage(admitHrLogo, "PNG", 10, 5, 20, 20)
            pdf.addImage(buniyaadLogo, "PNG", 180, 5, 20, 20)
    
         
             pdf.addImage(AdmitInstructions, "PNG", 20,124,160,155)
             pdf.addImage(StudentSignature, "PNG", 5, 285, 198, 5)
             pdf.addImage(VikalpaStamp, "PNG", 168, 268, 25, 23)
    
        
            pdf.setFontSize(10);
            pdf.text('E-Admit Card', 105, 10, {align:'center'})
            pdf.setFontSize(12);
            pdf.text('Directorate of School Education (DSE) Shiksha Sadan, Haryana', 105, 15, {align: "center"})
    
            // console.log('i am just after directorate of school')
            // pdf.setFontSize(8)
            // pdf.text('Pratibha Khoj hind', 100, 20)
            // for exam type:
    
            //below var is to show dynmaic exam type in admit card
            let examtype
            if (student.grade === "8") {
                examtype = "Mission Buniyaad"
            } else { examtype = "Haryana Super 100"}
    
            pdf.setFontSize(14);
            pdf.text(examtype, 105, 25, {align:'center'})
            pdf.setFontSize(10);
            pdf.text('Entrance Examination Level-2(2025-27)', 105, 30, {align:'center'})
    
            //for examination date
            
            // pdf.setFontSize(10);
            // pdf.text(`Reporting Date: ${student.L2examDate}`, 105, 35,{align:'center'})
           
            pdf.setFontSize(10);
            pdf.text(`Reporting Date: ${student.L2examDate}, Reporting Time: 08:00 AM, `, 105, 35, {align:"center"}) //Exam Time: ${student.L1examTime}
    
    
            // console.log(' i am just before formateDATE')
    
            //Changind date format to dd-mm-yyyy from db
            const formatDate = (dob) => {
                const [year, month, day] = dob.split("-"); // Split the string into year, month, and day
                return `${day}-${month}-${year}`; // Rearrange and join them in dd-mm-yyyy format
              };
    
            //________________________________________________________
    
            // console.log('i am just before table')
            
              // Table data
              const rows = [
                ["Name", student.name.toUpperCase() ],
                ["Father's Name", student.father.toUpperCase()],
                ["Date of Birth", formatDate(student.dob)],
                ["Category", student.category.toUpperCase()],
                ["SRN", student.srn ],
                ["Exam Roll Number", student.rollNumber],
                ["Aadhar Number", student.aadhar],
                ["Mobile Number", student.mobile],
                ["District/Code", student.L1districtAdmitCard.toUpperCase()],
                ["Block/Code", student.L1blockAdmitCard.toUpperCase()],
                ["Examination Center", student.L2examinationCenter.toUpperCase()],
                ["Batch", `Batch ${student.super100L2ExamBatchDivision.toUpperCase()} - (${student.super100L2BatchDateIntervals})`]
    
            ];
    
            // Generate table
            autoTable(pdf, {
                
                body: rows,
                startY: 36.5, // Adjust starting Y position. //43
                styles: {
                    fillColor: null, // No background color for rows
                    textColor: 0, // Black text color
                    tableLineColor: [0,0,0],
                    lineWidth: 0.5, // Set border line width
                    lineColor: 0,
                    halign: 'left', // Align text to the left
                    valign: 'middle', // Vertically align text in the middle
                    fontSize: 8
                },
                headStyles: {
                    fillColor: null, // No background color for header
                    textColor: 0, // Black text color for header
                    tableLineColor: [0,0,0],
                    fontStyle: 'normal', // Normal font for header
                    lineWidth: 0.5, // Set border line width for header
                },
                alternateRowStyles: {
                    fillColor: null, // Remove alternating row background
                },
                //tableLineColor: [0, 0, 0], // Black border color
             //   tableLineWidth: 0.5, // Border thickness
                columnStyles: {
                    0: { cellWidth: 50 }, // Column 1 width
                    1: { cellWidth: 100 }, // Column 2 width
                },
    
                
            });
    
           
    
            const photoText = `If no photograph
            is available, attach a 
            passport-sized photo attested 
            by the school..`
    
            if (student.image === null || student.image === "" || student.imageUrl === "" || !student.image || !student.imageUrl ) {
    
            
          
            pdf.setFontSize(8);
            pdf.text(photoText, 182, 55,{align:'center'})
    
    
                pdf.rect(166, 42.5, 38,38)
    
            } else  {
                // console.log('I AM BEFORE STUDENT PHOTO')
    
                //Some people uploaded pdf file for the student images, so below logic handles that.
                if(student.imageUrl.slice(-3) === "pdf") {
                    pdf.setFontSize(8);
                    pdf.text(photoText, 182, 55,{align:'center'})
                    pdf.rect(166, 42.5, 38,38)
                }else{pdf.addImage(student.imageUrl, "PNG", 166, 42.5, 38, 38);}
    
                
            }
            
            //Save pdf
            pdf.save(`${student.name}_${student.srn}_Admit-Card.pdf`)
    
            //Below api updates the admitCard1 status to true if the card is downloaded
            //Below api handles the admit card according to the level of exam.
            const formData = new FormData ();
            if (admitcardLevelMB === "Level1") {
                formData.append("admitCard1", admitCard1)
            } else if (student.grade === "10") {
                formData.append("admitCard2", admitCard2)
            }
            
    
            try {
    
                const response = await registrationServiceInstance.patchDownloadAdmitCardById(
                    id,
                    formData
                )
    
                console.log('Admit card downloaded')
                
            } catch (error) {
                console.error("Error Downloading Admit Card:", error);
                
            }


        }

        
    }

    


    return (
        <>
        
        {/* Below button is for downloading admit card. Uncomment it to activate admit card download. */}

        {/* <button class="blinking-text" id={student._id} onClick={DownloadAdmitCard} style={{fontSize:'20px'}}>Download <span style={{fontSize:"30px"}}>Admit Card</span> Haryana Super 100 <span style={{fontSize:"30px"}}>Level 1</span>. <br/>(हरियाणा सुपर 100 लेवल 1 एडमिट कार्ड डाउनलोड करने के लिए यहां क्लिक करें।) </button>
         */}
         {student.grade === "8" ? (
            <>
            <button class="blinking-text" id={student._id}  onClick={DownloadAdmitCard} style={{fontSize:'20px'}}>Downoload Mission Buniyaad <span style={{fontSize:"30px"}}>Counselling Admit Card</span>. <br/>(मिशन बुनियाद लेवल 3 एडमिट कार्ड डाउनलोड करें।) </button>
            </>
         ):(<>
         {/* <button class="blinking-text" id={student._id}  onClick={DownloadAdmitCard} style={{fontSize:'20px'}}>Downoload Haryana Super 100 <span style={{fontSize:"30px"}}>Level- 2 Admit Card</span>. <br/>(हरियाणा सुपर 100 लेवल 2 एडमिट कार्ड डाउनलोड करें।) </button> */}
         
         </>)}
         
        </>

    )

}