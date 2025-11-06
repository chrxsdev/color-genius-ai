'use client';

import { updateProfile } from '@/actions/profile.actions';
import { ProfileFormData, profileFormSchema } from '@/infrastructure/schemas/profile.schema';
import { FormEvent, useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { ZodError } from 'zod';

export interface UserInfo {
  id: string;
  full_name: string;
}

export interface ProfileFormProps {
  userInfo: UserInfo;
}

interface Feedback {
  type: 'success' | 'error' | 'info';
  message: string;
}

export const ProfileForm = ({ userInfo }: ProfileFormProps) => {
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: userInfo.full_name,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const validateForm = () => {
    try {
      profileFormSchema.parse(formData);
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error as ZodError;
        setFeedback({ type: 'error', message: zodError.issues[0].message });
      }
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback(null);

    const isFormValid = validateForm();

    if (!isFormValid) return;

    if (formData.full_name.trim() === userInfo.full_name) {
      setFeedback({ type: 'info', message: 'No changes to save' });
      return;
    }

    setIsLoading(true);

    try {
      const { success, error } = await updateProfile(userInfo.id, { full_name: formData.full_name.trim() });

      if (success) {
        setFeedback({ type: 'success', message: 'Profile updated successfully' });
        return;
      }
      setFeedback({ type: 'error', message: error ?? 'Failed to update profile' });
    } catch (error) {
      setFeedback({ type: 'error', message: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className=''>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col py-4 gap-y-2 h-40'>
          <label className='text-subtitle' htmlFor='full_name'>
            Name
          </label>
          <input
            id='full_name'
            type='text'
            value={formData.full_name}
            onChange={(e) => handleInputChange('full_name', e.target.value)}
            placeholder='John Doe'
            disabled={isLoading}
            className='w-full rounded-xl border-2 border-neutral-variant bg-background p-3 text-base text-white placeholder:text-slate-500 focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed'
          />
          {feedback && (
            <p
              className={`text-sm ${
                feedback.type === 'success'
                  ? 'text-primary'
                  : feedback.type === 'error'
                  ? 'text-error'
                  : 'text-tertiary'
              }`}
            >
              {feedback.message}
            </p>
          )}
        </div>
        <div className='flex justify-end mt-5'>
          <button
            type='submit'
            disabled={isLoading}
            className='flex justify-center items-center rounded-2xl bg-primary px-5 py-2 font-bold text-button-text transition-colors duration-200 ease-in-out hover:bg-primary/90 cursor-pointer gap-x-2 disabled:opacity-50 disabled:cursor-not-allowed'
          >
            <FaSave size={15} />
            {isLoading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
};
