// pages/payment/cancel.tsx

import React from 'react';
import ErrorCard from '@/components/ErrorCard';
import Navbar from '@/components/navbar';

const PaymentCancelPage: React.FC = () => {
    return <div>
        <Navbar />
        <div className='mt-10'>
            <ErrorCard message="Payment was canceled" />
        </div>
    </div>

        ;
};

export default PaymentCancelPage;
