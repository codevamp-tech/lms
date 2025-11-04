'use client'
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CreateCompanyFormProps {
  onSuccess: () => void;
}

const CreateCompanyForm: React.FC<CreateCompanyFormProps> = ({ onSuccess }) => {
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
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/create-company`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      console.log(result);
      if (response.ok) {

        setFormData({  // Reset form
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
        });
        onSuccess(); // Call the function to close the form/modal
      }
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  return (
    <div className="h-[450px] w-[450px] overflow-y-auto ">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Row 1 */}
          <Input
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500   "
            placeholder="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 "
            placeholder="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          {/* Row 2 */}
          <Input
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 "
            placeholder="Website"
            name="website"
            value={formData.website}
            onChange={handleChange}
          />
          <Input
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 "
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          {/* Row 3 */}
          <Input
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 "
            placeholder="GST"
            name="gst"
            value={formData.gst}
            onChange={handleChange}
            required
          />
          <select
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-card dark:border-gray-600 text-gray-500 dark:text-gray-400"
            name="subscriptionType"
            value={formData.subscriptionType}
            onChange={handleChange}
            required
          >
            <option value='' className='text-gray-500'>Select Subscription</option>
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
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-card dark:border-gray-600 dark:text-gray-400 text-gray-500 "
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
          <select
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-card dark:border-gray-600 dark:text-gray-400 text-gray-500 "
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value='' className='text-gray-500'>Select Status</option>
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
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Create Company'}
        </Button>
      </form>
    </div>
  );
};

export default CreateCompanyForm;


