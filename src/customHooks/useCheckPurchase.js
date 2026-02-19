import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Axios from '../utils/axios';
import SummaryApi from '../common/SummerAPI';

export const useCheckPurchase = (value, type = 'id') => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const checkStatus = async () => {
            const token = localStorage.getItem('access_token');
            if (!token) {
                if (isMounted) setLoading(false);
                return;
            }

            try {
                const res = await Axios({
                    url: SummaryApi.userDetails.url,
                    method: "get"
                });

                if (res.data.success && isMounted) {
                    const user = res.data.data;
                    const services = user.activeServices || [];

                    const purchased = services.find((s) => {
                        const currentStatus = s.status?.toString().toLowerCase().trim();
                        
                        const isPaid = currentStatus === 'paid' || 
                                       currentStatus === 'success' || 
                                       currentStatus === 'active' ||
                                       currentStatus === 'pending'; 

                        const dbValue = type === 'id' 
                            ? (s.serviceId || s._id) 
                            : (s.serviceName || s.planName);

                        const normalizedDB = dbValue?.toString().toLowerCase().trim();
                        const normalizedInput = value?.toString().toLowerCase().trim();
                        
                        const isMatch = normalizedDB === normalizedInput;

                        console.log(`Checking: "${normalizedDB}" vs "${normalizedInput}" | Status: ${currentStatus} | Match: ${isMatch}`);

                        return isPaid && isMatch;
                    });

                    if (purchased) {
                        console.log("✅ Match Found! Redirecting...");
                       navigate(`/upload-documents?serviceId=${purchased._id}`, { replace: true });
                    } else {
                        setLoading(false);
                    }
                }
            } catch (err) {
                console.error("Hook Error:", err);
                if (isMounted) setLoading(false);
            }
        };

        if (value) checkStatus();
        else setLoading(false);

        return () => { isMounted = false; };
    }, [value, type, navigate]);

    return { loading };
};