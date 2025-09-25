import { X } from 'lucide-react';
import React, { useEffect, useMemo } from 'react'
import { Input } from './components/input';
import { Select } from './components/select';
import { Domain } from '@/app/types/domain';
import { useForm } from 'react-hook-form';
import { Button } from './components/button';
import { useRouter } from 'next/navigation';
import useDataStore from '@/app/stores/dataStore';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod'
import { domainSchema } from '@/app/validation/validationSchemas';
import { Controller } from 'react-hook-form';


const activeStateOptions = [
  { value: 1, label: 'Active' },
  { value: 0, label: 'Inactive' }
];

const statusOptions = [
  { value: 2, label: 'Verified' },
  { value: 3, label: 'Rejected' },
  { value: 1, label: 'Pending' }
];

type DomainData = z.infer<typeof domainSchema>

const DomainManipulator = ({purpose, setIsManupulating, domain}: { purpose: "add" | "edit", setIsManupulating: Function, domain: Domain | undefined }) => {

  const defaultStatus = useMemo(() => domain?.status ?? statusOptions[0].value as 1 | 2 | 3 , [domain]);
  const defaultActive = useMemo(() => (domain?.isActive !== undefined ? (domain.isActive ? 1 : 0) : activeStateOptions[0].value) as 1 | 0 , [domain]);

  const { updateDomain, createDomain, fetchDomains } = useDataStore()
  const router = useRouter()

  const handleClose = () => {
    setIsManupulating({ isActive: false, purpose })
  }

  function capitalize(str: string) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  
  const {register, handleSubmit, control, formState: { errors, isSubmitting }, reset} = useForm<DomainData>({
      resolver: zodResolver(domainSchema)
  })


  const handleEditDomain = handleSubmit( async (data) => {

    // interpret 1 and 0 so that it matched the desired datatype
    const manipulatedData = {
      ...data,
      isActive: data.isActive === 1 ? true : false 
    }

    try {
      await updateDomain( domain!.id, manipulatedData)
      await fetchDomains()
    } catch (error) {
      console.log(error)
    } finally {
      reset()
      setIsManupulating({ isActive: false, purpose })
    }
  })
  
  const handleCreateDomain = handleSubmit( async (data) => {
    
    // interpret 1 and 0 so that it matched the desired datatype
    const manipulatedData = {
      ...data,
      isActive: data.isActive === 1 ? true : false,
      createdDate: new Date().toLocaleString()
    }
    
    try {
      await createDomain(manipulatedData)
      await fetchDomains()
    } catch (error) {
      console.log(error)
    } finally {
      reset()
      setIsManupulating({ isActive: false, purpose })
    }
  })

  return (
    <div className=''>
      <div onClick={handleClose} className='max-md:hidden w-[100vw] h-[100vh] fixed inset-0 bg-[#00000056]'></div>
      <div className='absolute top-[50%] left-[50%] max-md:fixed max-md:top-0 max-md:left-0 md:-translate-y-1/2 md:-translate-x-1/2 bg-white rounded-xl py-5 px-4 w-1/3 min-w-100 max-md:w-full max-md:min-h-[100vh]'>
        <header className='flex justify-between items-center'>
          <p className='text-[1.1rem] font-medium'>{`${capitalize(purpose)} Domain`}</p>
          <X onClick={handleClose} className='text-gray-400'/>
        </header>
        <form onSubmit={purpose === "edit" ? handleEditDomain : handleCreateDomain} className='py-5 space-y-5'>
          <div className='space-y-2'>
            <p className='text-[0.9rem]'>Domain</p>
            <Input
              placeholder="Domain's name..."
              defaultValue={domain?.domain}
              {...register('domain')}
            />
            <p className='text-red-600 text-[12px] mt-2 ml-2'>{errors.domain?.message}</p>
          </div>
          <div className='space-y-2'>
            <p className='text-[0.9rem]'>Status</p>
            <Controller
              name="status"
              control={control}
              defaultValue={defaultStatus}
              render={({ field }) => (
                <Select
                  options={statusOptions}
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </div>
          <div className='space-y-2'>
            <p className='text-[0.9rem]'>Active</p>
            <Controller
              name="isActive"
              control={control}
              defaultValue={defaultActive}
              render={({ field }) => (
                <Select
                  options={activeStateOptions}
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              )}
            />
          </div>
          <div className='flex justify-end gap-3 items-center'>
            <Button onClick={handleClose} variant='secondary' className="whitespace-nowrap">
              Cancel
            </Button>
            <Button type='submit' disabled={isSubmitting} className="whitespace-nowrap" >
              {isSubmitting ? "Saving..." : purpose === "edit" ? "Edit" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DomainManipulator
