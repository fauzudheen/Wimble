import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import createAxiosInstance from '../../../api/axiosInstance';
import { useSelector } from 'react-redux';
import { GatewayUrl } from '../../const/urls';
import { Card, CardContent, CardHeader, CardTitle } from '../../UIComponents';
import { Alert, AlertDescription, AlertTitle } from '../../UIComponents';
import { ScrollArea } from '../../UIComponents';
import Buttons from '../../user/misc/Buttons';

const UserReports = () => {
    const [reports, setReports] = useState([]);
    const [groupedReports, setGroupedReports] = useState({});
    const token = useSelector((state) => state.auth.adminAccess);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const axiosInstance = createAxiosInstance(token);
                const response = await axiosInstance.get(`${GatewayUrl}api/user-reports/`);
                setReports(response.data);

                // Group reports by reportee
                const grouped = response.data.reduce((acc, report) => {
                    const reporteeId = report.reportee.id;
                    if (!acc[reporteeId]) {
                        acc[reporteeId] = {
                            reportee: report.reportee,
                            reports: []
                        };
                    }
                    acc[reporteeId].reports.push(report);
                    return acc;
                }, {});

                // Sort reportees by number of reports
                const sortedGrouped = Object.values(grouped).sort((a, b) => b.reports.length - a.reports.length);
                setGroupedReports(sortedGrouped);
            } catch (error) {
                console.error('Error fetching reports:', error);
            }
        };

        fetchReports();
    }, [token]);

    const handleViewReports = (reporteeId) => {
        navigate(`/admin/users/${reporteeId}/reports`);
    };

    return (
        <div className="container mx-auto py-6 px-4 bg-transparent text-gray-800 dark:text-white min-h-screen">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-black dark:text-white bg-clip-text text-transparent">
                    User Reports
                </h2>
                <button 
                    className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-500 hover:to-blue-400 dark:from-teal-500 dark:to-blue-600 dark:hover:from-teal-400 dark:hover:to-blue-500 text-white font-semibold py-2 px-4 rounded-lg shadow"
                    onClick={() => window.history.back()}
                >
                    Back
                </button>
            </div>

            <ScrollArea className="h-[calc(100vh-200px)]">
                {groupedReports.length > 0 ? (
                    groupedReports.map(({ reportee, reports }) => (
                        <Card key={reportee.id} className="mb-4 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <CardHeader className="space-y-1.5">
                                <CardTitle className="text-lg font-semibold flex items-center">
                                    <span className="mr-2">👤</span>
                                    {reportee.first_name} {reportee.last_name}
                                </CardTitle>
                                <div className="text-sm space-y-1">
                                    <p className="text-gray-600 dark:text-gray-400 flex items-center">
                                    <span className="mr-2">📧</span>
                                    {reportee.email}
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400 flex items-center">
                                    <span className="mr-2">🏆</span>
                                    Account tier: <span className="font-medium ml-1">{reportee.account_tier}</span>
                                    </p>
                                    <p className="text-gray-600 dark:text-gray-400 flex items-center">
                                    <span className="mr-2">🗓️</span>
                                    Joined on: <span className="font-medium ml-1">{new Date(reportee.date_joined).toLocaleDateString()}</span>
                                    </p>
                                </div>
                                </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 dark:text-gray-400 mb-2">Reports: {reports.length}</p>
                                <button 
                                    // className="bg-gradient-to-r from-teal-500 mr-2 text-sm to-blue-600 hover:from-teal-500 hover:to-blue-500 dark:from-teal-500 dark:to-blue-700 dark:hover:from-teal-500 dark:hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow"
                                    className={`${Buttons.tealBlueGradientOutlineButton}`}
                                    onClick={() => handleViewReports(reportee.id)}
                                >
                                    View Reports
                                </button>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Alert className="bg-gray-100 dark:bg-gray-800 border-teal-500 dark:border-teal-500">
                        <AlertTitle className="text-teal-500 dark:text-teal-400">No Reports</AlertTitle>
                        <AlertDescription>There are currently no reports for any users.</AlertDescription>
                    </Alert>
                )}
            </ScrollArea>
        </div>
    );
};

export default UserReports;