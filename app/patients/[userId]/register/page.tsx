import React from 'react';
import Image from 'next/image';
import PatientForm from '@/components/forms/PatientForm';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import RegisterForm from '@/components/forms/RegisterForm';
import { getUser } from '@/lib/actions/patient.actions';

export default function Register({ params: { userId } }: SearchParamProps) {
  const user = getUser(userId);

  return (
    <div className="flex">
      <section className="w-[80%] max-w-[80%] hide-scrollbar">
        <div className="w-[90%] mt-10 space-x-14">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="carepulse-logo"
            className="h-10 w-fit mb-12 pl-14 "
          />
          <RegisterForm user={user} />
        </div>
      </section>

      <Image
        src="/assets/images/register-img.png"
        height={1000}
        width={1000}
        alt="register-img"
        className="max-w-[20%] side-img"
      />
    </div>

    // <div className="h-screen max-h-screen min-h-screen w-full overflow-hidden">
    //   <section className="flex flex-row">
    //     <div className="flex-1 min-w-[50%] pl-10 md:pl-20">
    //       <div className="flex flex-row items-center pt-20 ">
    //         <Image
    //           src="/assets/icons/logo-icon.svg"
    //           width={50}
    //           height={50}
    //           alt="carepulse-logo"
    //           className="object-contain"
    //         />
    //         <h1 className="text-xl text-white font-bold ml-1">Carepulse</h1>
    //       </div>
    //       <h1 className="text-2xl font-bold mt-10">Hi there &#128075;</h1>
    //       <p className="text-0.1xl mt-4 text-gray-300">
    //         Schedule your first appointment
    //       </p>
    //       <div className="mt-10">
    //         <Label htmlFor="email">Fullname</Label>
    //         <Input
    //           className="w-[90%] md:w-[85%] border-gray-500 bg-gray-800 mt-3 mb-3 shad-input"
    //           type="text"
    //           placeholder="Enter username"
    //         />
    //         <Label htmlFor="email">Email address</Label>
    //         <Input
    //           className="w-[90%] md:w-[85%] border-gray-500 bg-gray-800 mt-3 mb-3 shad-input"
    //           type="email"
    //           placeholder="Enter email"
    //         />
    //         <Label htmlFor="email">Fullname</Label>
    //         <Input
    //           className="w-[90%] md:w-[85%] border-gray-500 bg-gray-800 mt-3 mb-3 shad-input"
    //           type="text"
    //           placeholder="Enter username"
    //         />
    //       </div>
    //       <Button className="w-[90%] md:w-[85%] bg-green-500 mt-3">
    //         Get Started
    //       </Button>
    //       <footer>
    //         <div className="flex flex-row justify-between mt-16 w-[90%] md:w-[85%]">
    //           <p className="text-sm text-white">
    //             Carepulse {new Date().getFullYear()}
    //           </p>
    //           <p className="text-sm text-green-400">Admin</p>
    //         </div>
    //       </footer>
    //     </div>
    //     <div className="flex-1 max-w-[50%] hidden md:block min-w-[50%]">
    //       <Image
    //         src={'/assets/images/onboarding-img.png'}
    //         width={1000}
    //         height={1000}
    //         alt="register-img"
    //         className="object-cover min-h-screen max-h-screen"
    //       />
    //     </div>
    //   </section>
    // </div>
  );
}
