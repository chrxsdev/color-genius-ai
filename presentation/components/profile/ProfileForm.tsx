'use client';

import { FaSave } from 'react-icons/fa';

export const ProfileForm = () => {
  return (
    <div className=''>
      <form action=''>
        <div className='flex flex-col py-4 gap-y-2'>
          <label className='text-subtitle' htmlFor='full_name'>
            Name
          </label>
          <input
            id='full_name'
            type='text'
            value={''}
            onChange={() => ({})}
            placeholder='John Doe'
            className='w-full rounded-xl border-2 border-neutral-variant bg-background p-3 text-base text-white placeholder:text-slate-500 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all'
          />
        </div>
        <div className='flex justify-end'>
          <button className='flex justify-center items-center rounded-2xl bg-primary px-5 py-2 font-bold text-button-text transition-colors duration-200 ease-in-out hover:bg-primary/90 cursor-pointer gap-x-2'>
            <FaSave size={15} />
            Save
          </button>
        </div>
      </form>
    </div>
  );
};
