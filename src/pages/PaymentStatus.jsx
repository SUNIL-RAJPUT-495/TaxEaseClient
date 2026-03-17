import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Axios from '../utils/axios';
import SummaryApi from '../common/SummerAPI';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

const PaymentStatus = () => {
    const { transactionId } = useParams();
    const [status, setStatus] = useState('loading'); 
    const [message, setMessage] = useState('Verifying your payment... Please do not close this window.');

    useEffect(() => {
        const verifyOrderPayment = async () => {
            try {
                const res = await Axios({
                    url: SummaryApi.verifyPayment.url, 
                    method: 'POST',
                    data: { transactionId }
                });

                if (res.data.success) {
                    setStatus('success');
                    setMessage('Payment Successful! Your service has been activated.');
                } else {
                    setStatus('failed');
                    setMessage(res.data.message || 'Payment verification failed.');
                }
            } catch (error) {
                console.error("Verification Error:", error);
                setStatus('failed');
                setMessage('Could not verify payment at this time. If money was deducted, it will be updated shortly via webhook.');
            }
        };

        if (transactionId) {
            verifyOrderPayment();
        }
    }, [transactionId]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-slate-100">
                
                {status === 'loading' && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="w-16 h-16 animate-spin text-blue-600 mb-4" />
                        <h2 className="text-xl font-bold text-slate-800 mb-2">Processing...</h2>
                        <p className="text-slate-500 text-sm">{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Payment Successful!</h2>
                        <p className="text-slate-500 text-sm mb-6">{message}</p>
                        <p className="text-xs text-slate-400 mb-6">Transaction ID: {transactionId}</p>
                        <Link to="/dashboard" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all">
                            Go to Dashboard
                        </Link>
                    </div>
                )}

                {status === 'failed' && (
                    <div className="flex flex-col items-center">
                        <XCircle className="w-16 h-16 text-red-500 mb-4" />
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Payment Failed</h2>
                        <p className="text-slate-500 text-sm mb-6">{message}</p>
                        <p className="text-xs text-slate-400 mb-6">Transaction ID: {transactionId}</p>
                        <Link to="/services" className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-xl transition-all">
                            Try Again
                        </Link>
                    </div>
                )}

            </div>
        </div>
    );
};

export default PaymentStatus;