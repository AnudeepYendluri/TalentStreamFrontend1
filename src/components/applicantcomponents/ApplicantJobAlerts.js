import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../../services/ApplicantAPIService';
import { useUserContext } from '../common/UserProvider';
import { useNavigate } from 'react-router-dom';

export default function ApplicantJobAlerts({ setSelectedJobId }) {
  const [jobAlerts, setJobAlerts] = useState([]);
  const { user } = useUserContext();
  const navigate = useNavigate();
  const userId = user.id;

  useEffect(() => {
    const fetchJobAlerts = async () => {
      try {
        const response = await axios.get(`${apiUrl}/applyjob/applicant/job-alerts/${user.id}`);
        const alerts = response.data;
        setJobAlerts(alerts);
      } catch (error) {
        console.error('Error fetching job alerts:', error);
      }
    };
    fetchJobAlerts();
  }, [userId]);

  const handleJobAlertClick = async (job) => {
    try {
      // Call the backend API to mark the alert as seen
      await axios.put(`${apiUrl}/applyjob/applicant/mark-alert-as-seen/${job.alertsId}`);
      
      // Update the "seen" status of the clicked alert in the frontend
      const updatedJobAlerts = jobAlerts.map(alert => {
        if (alert.alertsId === job.alertsId) {
          return { ...alert, seen: true };
        }
        return alert;
      });
      setJobAlerts(updatedJobAlerts);
  
      // Show job details
      const jobId = job.applyJob && job.applyJob.job && job.applyJob.job.id;
      setSelectedJobId(jobId);
      console.log('Selected job ID:', jobId);
      navigate('/applicant-view-job');
    } catch (error) {
      console.error('Error marking alert as seen:', error);
    }
  };
  
  
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
    return formattedDate;
  }

 
  return (
    <div className="dashboard__content">
      <section className="page-title-dashboard">
        <div className="themes-container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="title-dashboard">
                <div className="title-dash flex2">Your Job Alerts</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="flat-dashboard-dyagram">
        <div className="themes-container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="box-notifications">
                {jobAlerts.length > 0 ? (
                  <ul>
                    {jobAlerts.map(job => (
                     <li key={job.alertsId} onClick={() => handleJobAlertClick(job)} className='inner bg-white' style={{ width: '100%', padding: '2%', borderRadius: '10px', position: 'relative', backgroundColor: job.seen ? '#F0F0F0' : '#FFFFFF' }}>
                     <div style={{ position: 'relative' }}>
                       {!job.seen && <div style={{ width: '10px', height: '10px', backgroundColor: 'red', borderRadius: '50%', position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '-15px' }}></div>}  
                       <h4>
  {job.status === "New" ? (
    `Your application is successfully submitted to ${job.companyName} for ${job.jobTitle} on ${formatDate(job.changeDate)}.`
  ) : (
    `Your application status is marked as ${job.status} by ${job.companyName} for ${job.jobTitle} on ${formatDate(job.changeDate)}.`
  )}
</h4>

                     </div>
                     {job.applyJob && (
                       <div>
                         <a href="#" className="p-16 color-3">{job.applyJob.jobTitle}</a>
                       </div>
                     )}
                   </li>                   
                    ))}
                  </ul>
                ) : (
                  <h3>No alerts are found.</h3>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

