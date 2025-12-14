// admission-generator.js

// --- CONSTANTS ---
const { jsPDF } = window.jspdf;
const CUTOFF_DATE = new Date('2025-11-01');
const AGE_REQUIREMENTS = { 'pp3': 3, 'pp2': 4, 'balvatika': 5, 'class1': 6, 'class2': 7, 'class3': 8, 'class4': 9, 'class5': 10 };

// --- CORE FUNCTIONS (Age Check, Toggle Fields) ---

function calculateAge(dob) {
    const studentDob = new Date(dob);
    let ageInYears = CUTOFF_DATE.getFullYear() - studentDob.getFullYear();
    const m = CUTOFF_DATE.getMonth() - studentDob.getMonth();
    if (m < 0 || (m === 0 && CUTOFF_DATE.getDate() < studentDob.getDate())) {
        ageInYears--;
    }
    return ageInYears;
}

function checkAge() {
    const dobInput = document.getElementById('dob');
    const classInput = document.getElementById('classApplied');
    const warningDiv = document.getElementById('ageWarning');
    const submitButton = document.getElementById('submitButton');

    const dobValue = dobInput.value;
    const classValue = classInput.value;
    
    warningDiv.style.display = 'none';
    submitButton.disabled = false;

    if (!dobValue || !classValue) return;

    if (AGE_REQUIREMENTS[classValue]) {
        const ageInYears = calculateAge(dobValue);
        const minAge = AGE_REQUIREMENTS[classValue];

        if (ageInYears < minAge) {
            warningDiv.innerHTML = `⚠️ **Ineligible for Admission:** Must be $\ge$ **${minAge} years** as of Nov 1, 2025, for **${classValue.toUpperCase()}**. Current age: ${ageInYears} years.`;
            warningDiv.style.display = 'block';
            submitButton.disabled = true;
        } else if (ageInYears > minAge + 2 && classValue.startsWith('class')) { 
            warningDiv.innerHTML = `⚠️ **Age Caution:** Student age (${ageInYears}) seems high for ${classValue.toUpperCase()}. Please verify the DOB or contact the school office.`;
            warningDiv.style.display = 'block';
            submitButton.disabled = false;
        } else {
            warningDiv.innerHTML = `✅ **Age Check Passed:** Student will be **${ageInYears} years** old on Nov 1, 2025.`;
            warningDiv.style.display = 'block';
            submitButton.disabled = false;
        }
    }
}

function toggleTransferFields() {
    const type = document.getElementById('admissionType').value;
    const transferFields = document.querySelectorAll('.transfer-field');
    const penInput = document.getElementById('studentPenNo');
    const tcInput = document.getElementById('uploadTC');

    if (type === 'transfer') {
        transferFields.forEach(field => field.style.display = 'block');
        penInput.setAttribute('required', 'required');
        tcInput.setAttribute('required', 'required');
    } else {
        transferFields.forEach(field => field.style.display = 'none');
        penInput.removeAttribute('required');
        tcInput.removeAttribute('required');
        penInput.value = ''; 
        tcInput.value = ''; 
    }
}

// --- MAIN PDF GENERATION LOGIC (Blueprint for Developer) ---
// NOTE: This function only draws basic text. A professional developer must 
// implement the PDF template drawing and document merging logic here.
async function generateUnifiedPDF(formData) {
    const doc = new jsPDF('p', 'mm', 'a4'); 
    let y = 10;
    const lineHeight = 7;
    const pageWidth = 210;
    const margin = 15;
    const data = {};
    
    formData.forEach((value, key) => data[key] = value);

    // --- TEMPORARY PAGE 1: ADMISSION FORM DATA ---
    doc.setFontSize(16);
    doc.text("Admission Form Data Summary (Page 1)", pageWidth / 2, y, { align: "center" });
    y += lineHeight * 2;
    
    doc.setFontSize(10);
    doc.text(`Student: ${data.studentName} | Class: ${data.classApplied}`, margin, y);
    y += lineHeight;
    doc.text(`Parent: ${data.fatherName} | Cell: ${data.fatherCellNo}`, margin, y);
    y += lineHeight;

    // --- TEMPORARY PAGE 2: APPAR CONSENT DATA ---
    doc.addPage();
    y = 10;
    doc.setFontSize(16);
    doc.text("APPAR Consent Summary (Page 2)", pageWidth / 2, y, { align: "center" });
    y += lineHeight * 2;

    doc.setFontSize(10);
    doc.text(`Aadhaar: ${data.aadhaarNumber}`, margin, y);
    y += lineHeight;
    doc.text(`Consent Proof: ${data.parentConsentProof} (No: ${data.parentProofNumber})`, margin, y);
    y += lineHeight;

    // --- TEMPORARY PAGE 3+: UPLOADED DOCUMENTS (Simplified Check) ---
    // The actual file embedding logic is complex and must be implemented professionally.
    
    doc.addPage();
    doc.setFontSize(14);
    doc.text("File Upload Confirmation", pageWidth / 2, 10, { align: "center" });
    doc.setFontSize(10);
    
    const fileInputs = ['uploadPhoto', 'uploadBirthCert', 'uploadBloodReport', 'uploadStudentAadhaar', 'uploadParentAadhaar', 'uploadTC'];
    let fileY = 30;

    fileInputs.forEach(key => {
        const fileInput = document.getElementById(key);
        if (fileInput && fileInput.files.length > 0) {
            doc.text(`✅ Received: ${key} (${fileInput.files[0].name})`, margin, fileY);
        } else {
            doc.text(`❌ Missing/Empty: ${key}`, margin, fileY);
        }
        fileY += lineHeight;
    });

    // -------------------------------------------------------------
    // D. FINALIZE AND DOWNLOAD
    // -------------------------------------------------------------
    doc.save(`Admission_Packet_${data.studentName.replace(/\s/g, '_')}_2026.pdf`);
    return Promise.resolve(); // Ensure this is always returned
}

// --- EVENT HANDLERS ---
document.addEventListener('DOMContentLoaded', () => {
    const fatherNameInput = document.getElementById('fatherName');
    const declarationNameSpan = document.getElementById('declarationParentName');

    // Dynamic Declaration Name
    fatherNameInput.addEventListener('input', () => {
        declarationNameSpan.textContent = fatherNameInput.value || '[Father/Mother Name]';
    });

    // Initial checks
    toggleTransferFields();
    checkAge();

    document.getElementById('dob').addEventListener('change', checkAge);
    document.getElementById('classApplied').addEventListener('change', checkAge);
    
    // ** CRITICAL SUBMISSION HANDLER **
    const form = document.getElementById('combinedAdmissionForm');
    const submitButton = document.getElementById('submitButton');
    
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Stop the default browser submission
        
        if (submitButton.disabled) {
            alert("Cannot submit: Eligibility requirements are not met.");
            document.getElementById('ageWarning').scrollIntoView();
            return;
        }
        
        if (!this.checkValidity()) {
             // This uses the browser's native required field validation popups
             return;
        }

        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating PDF...';
        submitButton.disabled = true;

        const formData = new FormData(this);
        
        // Execute the client-side PDF generation
        generateUnifiedPDF(formData).finally(() => {
            // Reset button state after generation completes (or fails)
            submitButton.innerHTML = '<i class="fas fa-file-download"></i> Submit Application & Generate Unified PDF Packet';
            submitButton.disabled = false;
        }).catch(error => {
            console.error("PDF Generation failed:", error);
            alert("PDF generation failed. Check browser console for errors.");
        });
    });
});
