'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  carPlateNumber: Yup.string()
    .required('Plate number is required')
    .matches(/^[0-9]{2}[A-Za-z]{1}[0-9]{3}[0-9]{2}$/, 'Invalid plate number format'),
  carColor: Yup.string()
    .required('Car color is required')
    .min(2, 'Car color must be at least 2 characters'),
  carModel: Yup.string()
    .required('Car model is required')
    .min(2, 'Car model must be at least 2 characters'),
});

export default function DriverProfilePage() {
  const handleSubmit = (values: any) => {
    console.log('Form values:', values);
    // Here you can send data to server
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-6 shadow-2xl border border-blue-500/30">
        <h1 className="text-2xl font-bold text-white mb-6 text-center bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text">
          Driver Profile
        </h1>
        
        <Formik
          initialValues={{
            carPlateNumber: '',
            carColor: '',
            carModel: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="carPlateNumber" className="block text-white font-medium mb-2">
                  Plate Number
                </label>
                <Field
                  type="text"
                  id="carPlateNumber"
                  name="carPlateNumber"
                  placeholder="Example: 12A34567"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <ErrorMessage name="carPlateNumber" component="div" className="text-red-400 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="carColor" className="block text-white font-medium mb-2">
                  Car Color
                </label>
                <Field
                  type="text"
                  id="carColor"
                  name="carColor"
                  placeholder="Example: White"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <ErrorMessage name="carColor" component="div" className="text-red-400 text-sm mt-1" />
              </div>

              <div>
                <label htmlFor="carModel" className="block text-white font-medium mb-2">
                  Car Model
                </label>
                <Field
                  type="text"
                  id="carModel"
                  name="carModel"
                  placeholder="Example: Toyota Camry"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <ErrorMessage name="carModel" component="div" className="text-red-400 text-sm mt-1" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold py-3 px-4 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isSubmitting ? 'Saving...' : 'Save Information'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}