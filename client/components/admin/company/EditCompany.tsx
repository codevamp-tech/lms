'use client'
import { useEffect, useState } from 'react'

import CompanyTab from './CompanyTab'


const EditCompanyForm = () => {




  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Company</h1>
      <CompanyTab companyId={''} />
    </div>
  )
}

export default EditCompanyForm