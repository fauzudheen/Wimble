import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import createAxiosInstance from '../../../api/axiosInstance';
import { GatewayUrl } from '../../const/urls';
import { Card, CardContent, CardHeader, CardTitle, ScrollArea, Alert, AlertDescription, AlertTitle, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, Button } from '../../UIComponents';
import { AlertTriangle, Ban, Calendar, Mail, Shield, Trophy, User, UserCircle } from 'lucide-react';

const UserReportDetails = () => {
    const { id: reporteeId } = useParams();
    const [reportee, setReportee] = useState(null);
    const [reports, setReports] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const token = useSelector((state) => state.auth.adminAccess);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReportDetails = async () => {
            try {
                const axiosInstance = createAxiosInstance(token);
                const response = await axiosInstance.get(`${GatewayUrl}api/users/${reporteeId}/reports/`);
                setReports(response.data);
                setReportee(response.data[0].reportee);
            } catch (error) {
                console.error('Error fetching report details:', error);
            }
        };

        fetchReportDetails();
    }, [reporteeId, token]);

    const handleFlag = async () => {
        try {
            const axiosInstance = createAxiosInstance(token);
            await axiosInstance.patch(`${GatewayUrl}api/users/${reporteeId}/`, { "is_active": false });
            await axiosInstance.delete(`${GatewayUrl}api/user-reports/${reporteeId}/`);
            navigate('/admin/users/reports');
        } catch (error) {
            console.error('Error flagging user:', error);
        }
        setDialogOpen(false);
    };

    return (
        <div className="container mx-auto py-6 px-4 bg-transparent text-gray-800 dark:text-white min-h-screen">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold dark:text-white">
                    User Report Details
                </h2>
                <Button 
                    variant="outline"
                    onClick={() => window.history.back()}
                    className="text-sm bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white dark:text-white"
                >
                    Back to Reports
                </Button>
            </div>

            {reportee && (
                <Card className="mb-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl font-bold flex items-center">
                    <UserCircle className="mr-2 h-6 w-6" />
                    {reportee.first_name} {reportee.last_name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-gray-500" />
                      <p className="text-sm">{reportee.email}</p>
                    </div>
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4 text-gray-500" />
                      <p className="text-sm">{reportee.username}</p>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                      <p className="text-sm">Joined: {new Date(reportee.date_joined).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center">
                      <Trophy className="mr-2 h-4 w-4 text-gray-500" />
                      <p className="text-sm capitalize">Account Tier: {reportee.account_tier}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Shield className="mr-2 h-4 w-4 text-gray-500" />
                      <p className="text-sm">Status: 
                        <span className={`ml-1 font-semibold ${reportee.is_active ? 'text-green-500' : 'text-red-500'}`}>
                          {reportee.is_active ? 'Active' : 'Blocked'}
                        </span>
                      </p>
                    </div>
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                      <DialogTrigger asChild>
                        <Button 
                          variant="destructive" 
                          className="flex items-center gap-2 text-sm"
                        >
                          <Ban size={14} />
                          Block User
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Block</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to block this user? This action can be undone in the users section.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                          <Button variant="destructive" onClick={handleFlag}>Confirm</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            )}

            <ScrollArea className="h-[calc(100vh)]">
                {reports.length > 0 ? (
                    reports.map((report, index) => (
                        <Card key={report.id} className="mb-4">
                            <CardHeader>
                                <CardTitle>Report {index + 1}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-2 text-sm">Reported by: {report.reporter.first_name} {report.reporter.last_name}</p>
                                <p className="mb-2 text-sm">Date: {new Date(report.created_at).toLocaleDateString()}</p>
                                <p className="text-gray-600 dark:text-gray-300 font-semibold italic">"{report.text}"</p>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Alert>
                        <AlertTitle>No Reports</AlertTitle>
                        <AlertDescription>There are currently no reports for this user.</AlertDescription>
                    </Alert>
                )}
            </ScrollArea>
        </div>
    );
};

export default UserReportDetails;