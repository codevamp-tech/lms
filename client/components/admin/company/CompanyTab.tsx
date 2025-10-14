'use client'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'


const EditCompanyForm = () => {
  const { companyId } = useParams();
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    website: '',
    email: '',
    phone: '',
    billingAddress: '',
    gst: '',
    subscriptionType: '',
    trialDuration: '',
    date: '',
    status: '',
  })
  const [loading, setLoading] = useState(true)

  // Fetch existing company data
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await fetch(`https://lms-v4tz.onrender.com/companies/${companyId}`)
        const data = await response.json()

        setFormData({
          name: data.name,
          website: data.website || '',
          email: data.email,
          phone: data.phone,
          billingAddress: data.billingAddress,
          gst: data.gst,
          trialDuration: data.trialDuration || '',
          subscriptionType: data.subscriptionType,
          date: data.date ? data.date.split("T")[0] : "",
          status: data.status,
        })
        setLoading(false)
      } catch (error) {
        console.error('Error fetching company data:', error)
        setLoading(false)
      }
    }

    fetchCompanyData()
  }, [companyId])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`https://lms-v4tz.onrender.com/companies/edit-company/${companyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const result = await response.json()
      console.log('Update successful:', result)
      router.push('/admin/company')
    } catch (error) {
      console.error('Error:', error)
    }
    setLoading(false)
  }

  if (loading) return <div className="text-center py-4">Loading...</div>

  return (
    <div className="h-[450px] w-full overflow-y-auto">
      <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-card rounded-lg">
        <div className="grid grid-cols-2 gap-4">
          <Input
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Company Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <Input
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <Input
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Website"
            name="website"
            value={formData.website}
            onChange={handleChange}
          />

          <Input
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            placeholder="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <Input
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="GST Number"
            name="gst"
            value={formData.gst}
            onChange={handleChange}
            required
          />

          <select
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-card dark:border-gray-600  dark:text-gray-400"
            name="subscriptionType"
            value={formData.subscriptionType}
            onChange={handleChange}
            required
          >

            <option value="Monthly" className='text-gray-500'>Monthly</option>
            <option value="Quarterly" className='text-gray-500'>Quarterly</option>
            <option value="Half-Yearly" className='text-gray-500'>Half-Yearly</option>
            <option value="Annually" className='text-gray-500'>Annually</option>
            <option value="Trial" className='text-gray-500'>Trial</option>
          </select>

          {formData.subscriptionType === 'Trial' && (
            <Input
              className="w-full p-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:text-gray-400 bg-transparent"
              placeholder="Trial Duration (in days)"
              name="trialDuration"
              value={formData.trialDuration}
              onChange={handleChange}
              required
            />
          )}

          {/* Row 4 */}

          <Input
            className="w-full p-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 dark:border-gray-600 dark:text-gray-400 bg-transparent"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <select
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-card dark:border-gray-600 dark:text-gray-400   "
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="Active" className='text-gray-500'>Active</option>
            <option value="Inactive" className='text-gray-500'>Inactive</option>
            <option value="On-Hold" className='text-gray-500'>On-Hold</option>
          </select>
        </div>

        {/* Full width textarea */}
        <textarea
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 min-h-[100px] dark:bg-card dark:border-gray-600 dark:text-white placeholder:text-gray-500"
          placeholder="Billing Address"
          name="billingAddress"
          value={formData.billingAddress}
          onChange={handleChange}
          required
        />


        <Button
          type="submit"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Company'}
        </Button>
        <Link href="/admin/company">
          <button
            className='ml-4 border border-black px-3 py-1 rounded'>
            Cancel
          </button>
        </Link>

      </form>
    </div>
  )
}

export default EditCompanyForm