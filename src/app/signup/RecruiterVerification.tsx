"use client";
import React from "react";
import { Formik, Form } from "formik";
import { recruiterValidationSchema } from "@/utils/schema";
import { Modal } from "antd";
import CustomInput from "@/components/Inputs/customInput";
import { RecruiterVerificationData } from "../../utils/Types";

interface RecruiterVerifcationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: (verifiedData: RecruiterVerificationData) => void;
}

const RecruiterVerificationModal: React.FC<RecruiterVerifcationModalProps> = ({
  isOpen,
  onClose,
  onVerified,
}) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      title="Verify Recruiter Details"
    >
      <Formik
        initialValues={{
          companyEmail: "",
          linkedInProfile: "",
          registrationNumber: "",
          jobPostingsURL: "",
          websiteURL: "",
          reviewsInfo: "",
        }}
        validationSchema={recruiterValidationSchema}
        onSubmit={(values) => {
          onVerified(values);
          onClose();
        }}
      >
        <Form className="grid grid-cols-1 gap-3">
          <CustomInput
            name="companyEmail"
            label="Company Domain Email"
            placeholder="e.g. name@company.com"
          />
          <CustomInput
            name="linkedInProfile"
            label="LinkedIn Profile URL"
            placeholder="https://linkedin.com/in/yourprofile"
          />
          <CustomInput
            name="registrationNumber"
            label="Company Registration Number (CIN, etc.)"
            placeholder="e.g. U12345DL2023PTC000000"
          />
          <CustomInput
            name="jobPostingsURL"
            label="Link to Verified Job Postings"
            placeholder="e.g. Naukri, Indeed, etc."
          />
          <CustomInput
            name="websiteURL"
            label="Company Website URL"
            placeholder="https://company.com"
          />
          <CustomInput
            name="reviewsInfo"
            label="Trust Signals (Glassdoor rating, etc.)"
            placeholder="e.g. 4.2/5 on Glassdoor"
          />
          <button
            type="submit"
            className="bg-[#5E17EB] text-white font-semibold py-2 mt-2 rounded-lg hover:bg-[#4c0fc0]"
          >
            Submit Verification
          </button>
        </Form>
      </Formik>
    </Modal>
  );
};

export default RecruiterVerificationModal;
