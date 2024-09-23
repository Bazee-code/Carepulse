'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl } from '@/components/ui/form';

import CustomFormField from '../CustomFormField';
import SubmitButton from '../SubmitButton';
import { useState } from 'react';
import { PatientFormValidation } from '@/lib/validation';
import { useRouter } from 'next/navigation';
import { registerPatient } from '@/lib/actions/patient.actions';
import { parseStringify } from '@/lib/utils';
import { FormFieldType } from './PatientForm';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from '@/constants';
import { Label } from '@radix-ui/react-label';
import { SelectItem } from '../ui/select';
import Image from 'next/image';
import { FileUploader } from '../FileUploader';

export default function RegisterForm({ user }: { user: User }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: '',
      email: '',
      phone: '',
    },
  });
  // console.log('currentUser', parseStringify(u));
  let parsedUser = parseStringify(user);
  // console.log('parsedUser', parsedUser?.value);

  console.log('current user', parsedUser);

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setIsLoading(true);

    let formData;

    if (
      values.identificationDocument &&
      values.identificationDocument?.length > 0
    ) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      });

      formData = new FormData();
      formData.append('blobFile', blobFile);
      formData.append('fileName', values.identificationDocument[0].name);
    }

    try {
      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData,
      };
      console.log('patientData', patientData);
      const patient = await registerPatient(patientData);
      console.log('patient', patient);

      if (patient) router.push(`/patients/${patient.$id}/new_appointment`);
    } catch (e) {
      console.log(e);
    }
    // setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 w-full mb-10 "
      >
        <section className="mb-12 space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">Let us know more about yourself</p>
        </section>

        <div className="w-full max-w-[100%] md:max-w-[90%]">
          <h1 className="header mb-5">Personal information</h1>
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="name"
            label="Full name"
            placeholder="Enter your name"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
            className="shad-input border-0"
          />
          <div className="flex flex-col md:flex-row mt-4">
            <div className="flex-1 mb-3 md:mr-4 md:mb-0">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                name="email"
                label="Email address"
                placeholder="Enter your email"
                iconSrc="/assets/icons/email.svg"
                iconAlt="email"
                className="shad-input border-0 "
              />
            </div>
            <div className="flex-1">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.PHONE_INPUT}
                name="phone"
                label="Phone number"
                placeholder="Enter your number"
                iconSrc="/assets/icons/phone.svg"
                iconAlt="phone"
                className="shad-input border-0 pl-2"
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row mt-4">
            <div className="flex-1 mb-3 md:mr-4 md:mb-0">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.DATE_PICKER}
                name="birthDate"
                label="Date of birth"
                placeholder="Select your birthdate"
                iconSrc="/assets/icons/calendar.svg"
                iconAlt="date"
                className="shad-input border-0 "
              />
            </div>
            <div className="flex-1 ">
              {/* <CustomFormField
                control={form.control}
                fieldType={FormFieldType.RADIO}
                name="gender"
                label="Gender"
                className=" flex-1 shad-input pl-2 flex rounded-md border border-dark-500 bg-dark-400 items-center"
              /> */}
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.SKELETON}
                name="gender"
                label="Gender"
                renderSkeleton={(field) => (
                  <FormControl>
                    <RadioGroup
                      className="flex h-11 gap-6 xl:justify-between"
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      {GenderOptions.map((option) => (
                        <div className="radio-group" key={option}>
                          <RadioGroupItem value={option} id={option} />
                          <Label htmlFor={option} className="cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row mt-4">
            <div className="flex-1 mb-3 md:mr-4 md:mb-0">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                name="address"
                label="Physical address"
                placeholder="ex:Nairobi, Kenya"
                className="shad-input border-0 "
              />
            </div>
            <div className="flex-1">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                name="occupation"
                label="Occupation"
                placeholder="ex: Doctor"
                className="shad-input border-0 "
              />
            </div>
          </div>
        </div>

        <div className="w-full max-w-[100%] md:max-w-[90%]">
          <h1 className="header my-8">Medical information</h1>
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SELECT}
            name="primaryPhysician"
            label="Primary care physician"
            placeholder="Dr.Eugene Obare"
            className="shad-input border-0"
          >
            {Doctors.map((doc) => (
              <SelectItem key={doc.name} value={doc.name}>
                <div className="flex cursor-pointer items-center gap-2">
                  <Image
                    src={doc.image}
                    width={32}
                    height={32}
                    alt={doc.name}
                    className="rounded-full border border-dark-500"
                  />
                  <p>{doc.name}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>

          <div className="flex flex-col md:flex-row mt-4">
            <div className="flex-1 mb-3 md:mr-4 md:mb-0">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                name="insuranceProvider"
                label="Insurance Provider"
                placeholder="ex: Britam"
                className="shad-input border-0 "
              />
            </div>
            <div className="flex-1">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.INPUT}
                name="insurancePolicyNumber"
                label="Insurance policy number"
                placeholder="ex: ABC12345"
                className="shad-input border-0 "
              />
            </div>
          </div>

          <div className="mt-4">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name="allergies"
              label="Allergies"
              placeholder="Allergies (if any)"
              className="shad-input border-0"
            />
          </div>
        </div>

        <div className="w-full max-w-[100%] md:max-w-[90%]">
          <h1 className="header my-8">Identification and Verification</h1>
          <div className="mt-4">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SELECT}
              name="identificationType"
              label="Identification Type"
              placeholder="Select an identification type"
              className="shad-input border-0"
            >
              {IdentificationTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </CustomFormField>
          </div>
          <div className="mt-4">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name="identificationNumber"
              label="Identification Number"
              placeholder="ex: 12345"
              className="shad-input border-0"
            />
          </div>
          <div className="mt-4">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SKELETON}
              name="identificationDocument"
              label="Scanned Copy of Identification Document"
              className="shad-input border-0 "
              renderSkeleton={(field) => (
                <FormControl>
                  <FileUploader files={field.value} onChange={field.onChange} />
                </FormControl>
              )}
            />
          </div>
        </div>

        <div className="w-full max-w-[100%] md:max-w-[90%]">
          <h1 className="header my-8">Consent and Privacy</h1>
          <div className="mt-4">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.CHECKBOX}
              name="treatmentConsent"
              label="I consent to receive treatment for my health conditions"
              className="shad-input border-0"
            />
          </div>
          <div className="mt-4">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.CHECKBOX}
              name="disclosureConsent"
              label="I consent to the use and disclosure of my health information for treatment purposes."
              className="shad-input border-0"
            />
          </div>
          <div className="mt-4 mb-5">
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.CHECKBOX}
              name="privacyConsent"
              label="I acknowledge that i have reviewed and agree to the privacy policy"
              className="shad-input border-0 "
            />
          </div>
        </div>
        <SubmitButton
          className="shad-primary-btn w-[100%] md:w-[90%]"
          // isLoading={isLoading}
        >
          Submit and Continue
        </SubmitButton>
      </form>
    </Form>
  );
}
