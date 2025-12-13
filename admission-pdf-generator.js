            <div class="form-section">
                <h3>4. Document Upload (PDF/JPG/PNG)</h3>
                <p>These files will be merged into your final submission packet. Upload clear copies only.</p>
                
                <div class="form-grid">
                    <div class="form-group photo-upload-group">
                        <label for="uploadPhoto">Passport Size Student Photograph <span class="required-star">*</span></label>
                        <input type="file" id="uploadPhoto" name="uploadPhoto" accept=".jpg, .jpeg, .png" required>
                    </div>

                    <div class="form-group">
                        <label for="uploadBirthCert">Birth Certificate (Registrar Births & Deaths) <span class="required-star">*</span></label>
                        <input type="file" id="uploadBirthCert" name="uploadBirthCert" accept=".pdf, .jpg, .jpeg" required>
                    </div>
                    <div class="form-group">
                        <label for="uploadBloodReport">Blood Group Report <span class="required-star">*</span></label>
                        <input type="file" id="uploadBloodReport" name="uploadBloodReport" accept=".pdf, .jpg, .jpeg" required>
                    </div>
                    <div class="form-group">
                        <label for="uploadStudentAadhaar">Student Aadhaar Card <span class="required-star">*</span></label>
                        <input type="file" id="uploadStudentAadhaar" name="uploadStudentAadhaar" accept=".pdf, .jpg, .jpeg" required>
                    </div>
                    <div class="form-group">
                        <label for="uploadParentAadhaar">Parent Aadhaar Card <span class="required-star">*</span></label>
                        <input type="file" id="uploadParentAadhaar" name="uploadParentAadhaar" accept=".pdf, .jpg, .jpeg" required>
                    </div>
                    <div class="form-group transfer-field" id="tc-field" style="display:none;">
                        <label for="uploadTC">Transfer Certificate (TC) <span class="required-star">*</span></label>
                        <input type="file" id="uploadTC" name="uploadTC" accept=".pdf, .jpg, .jpeg">
                    </div>
                </div>
            </div>

            <div class="submit-btn-container">
                <button type="submit" class="submit-btn" id="submitButton">
                    <i class="fas fa-file-download"></i> Submit Application & Generate Unified PDF Packet
                </button>
            </div>
            
        </form>
    </div>
              
