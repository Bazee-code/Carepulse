'use client';

import React from 'react';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { E164Number } from 'libphonenumber-js/core';

import { Control } from 'react-hook-form';
import { FormFieldType } from './forms/PatientForm';
import Image from 'next/image';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import DatePicker from 'react-datepicker';
import { Textarea } from '@/components/ui/textarea';

import 'react-datepicker/dist/react-datepicker.css';

interface CustomProps {
  control: Control<any>;
  fieldType: FormFieldType;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  className?: string;
  renderSkeleton?: (field: any) => React.ReactNode;
}

interface RenderFieldProps {
  field: any;
  props: CustomProps;
}

const RenderField = ({ field, props }: RenderFieldProps) => {
  const {
    fieldType,
    iconSrc,
    iconAlt,
    placeholder,
    className,
    showTimeSelect,
    dateFormat,
    renderSkeleton,
  } = props;

  switch (fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          {iconSrc && (
            <Image
              src={iconSrc}
              width={24}
              height={24}
              className="ml-2"
              alt={iconAlt || 'icon'}
            />
          )}

          <FormControl>
            <Input placeholder={placeholder} {...field} className={className} />
          </FormControl>
        </div>
      );

    case FormFieldType.PHONE_INPUT:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          <FormControl>
            <PhoneInput
              placeholder={placeholder}
              value={field.value as E164Number | undefined}
              defaultCountry="KE"
              international
              withCountryCallingCode
              onChange={field.onChange}
              className={className}
            />
          </FormControl>
        </div>
      );

    case FormFieldType.DATE_PICKER:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          <Image
            src="/assets/icons/calendar.svg"
            height={24}
            width={24}
            alt="calendar"
            className="ml-2"
          />
          <FormControl>
            <DatePicker
              selected={field.value}
              onChange={(date) => field.onChange(date)}
              dateFormat={dateFormat ?? 'MM/dd/yyyy'}
              showTimeSelect={showTimeSelect ?? false}
              timeInputLabel="Time:"
              wrapperClassName="date-picker"
            />
          </FormControl>
        </div>
      );

    case FormFieldType.SKELETON:
      return renderSkeleton ? renderSkeleton(field) : null;

    case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="shad-select-trigger">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="shad-select-content">
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      );

    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={placeholder}
            {...field}
            className="shad-textArea"
            disabled={props.disabled}
          />
        </FormControl>
      );

    case FormFieldType.CHECKBOX:
      return (
        <div className="flex items-center space-x-2">
          <Checkbox
            id={props.name}
            checked={field.value}
            onCheckedChange={field.onChange}
          />
          <label
            htmlFor={props.name}
            className="text-sm pl-2 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 "
          >
            {props.label}
          </label>
        </div>
      );

    // case FormFieldType.RADIO:
    //   return (
    //     <RadioGroup defaultValue="male">
    //       <div className="flex flex-row space-x-3 ">
    //         <div className={className}>
    //           <RadioGroupItem value="male" id="male" />
    //           <Label htmlFor="male" className="pl-2">
    //             Male
    //           </Label>
    //         </div>
    //         <div className={className}>
    //           <RadioGroupItem value="female" id="female" />
    //           <Label htmlFor="female" className="pl-2">
    //             Female
    //           </Label>
    //         </div>
    //         <div className={className}>
    //           <RadioGroupItem value="other" id="other" />
    //           <Label htmlFor="other" className="pl-2">
    //             Other
    //           </Label>
    //         </div>
    //       </div>
    //     </RadioGroup>
    //   );

    // case FormFieldType.SELECT:
    //   return (
    //     <Select>
    //       <SelectTrigger className="w-full shad-input border border-dark-500 bg-dark-400">
    //         <SelectValue placeholder="Select a physician" />
    //       </SelectTrigger>
    //       <SelectContent>
    //         <SelectGroup>
    //           <SelectLabel>Fruits</SelectLabel>
    //           <SelectItem value="eugene">Eugene</SelectItem>
    //           <SelectItem value="brian">Brian</SelectItem>
    //           <SelectItem value="nimu">Nimu</SelectItem>
    //         </SelectGroup>
    //       </SelectContent>
    //     </Select>
    //   );

    default:
      break;
  }
};

export default function CustomFormField(props: CustomProps) {
  const { control, name, fieldType, label } = props;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel>{label}</FormLabel>
          )}

          <RenderField field={field} props={props} />

          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  );
}
