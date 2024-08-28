import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import createAxiosInstance from '../../../api/axiosInstance';
import { GatewayUrl } from '../../const/urls';
import { Card, CardContent, CardHeader, CardTitle, ScrollArea, Alert, AlertDescription, AlertTitle, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, Button } from '../../UIComponents';
import { AlertTriangle } from 'lucide-react';

const ArticleReportDetails = () => {
    const { id: articleId } = useParams();
    const [article, setArticle] = useState(null);
    const [reports, setReports] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const token = useSelector((state) => state.auth.adminAccess);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReportDetails = async () => {
            try {
                const axiosInstance = createAxiosInstance(token);
                const response = await axiosInstance.get(`${GatewayUrl}api/articles/${articleId}/reports/`);
                setReports(response.data);
                setArticle(response.data[0].article);
            } catch (error) {
                console.error('Error fetching report details:', error);
            }
        };

        fetchReportDetails();
    }, [articleId, token]);

    const handleFlag = async () => {
        try {
            const axiosInstance = createAxiosInstance(token);
            await axiosInstance.patch(`${GatewayUrl}api/articles/${articleId}/`, { "is_flagged": true });
            await axiosInstance.delete(`${GatewayUrl}api/article-reports/${articleId}/`);
            navigate('/admin/articles/reports');
        } catch (error) {
            console.error('Error flagging article:', error);
        }
        setDialogOpen(false);
    };

    return (
        <div className="container mx-auto py-6 px-4 bg-transparent text-gray-800 dark:text-white min-h-screen">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold dark:text-white">
                    Article Report Details
                </h2>
                <Button 
                    variant="outline"
                    onClick={() => window.history.back()}
                    className="text-sm bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white dark:text-white"
                >
                    Back to Reports
                </Button>
            </div>

            {article && (
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">Author: {article.author}</p>
                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogTrigger asChild>
                                <Button 
                                    variant="destructive" 
                                    className="flex items-center gap-2 text-sm"
                                >
                                    <AlertTriangle size={18} />
                                    Flag Down
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Confirm Flag Down</DialogTitle>
                                    <DialogDescription>
                                        Are you sure you want to flag down this article? This action cannot be undone.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                                    <Button variant="destructive" onClick={handleFlag}>Confirm</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
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
                                <p className="mb-2 text-sm">Reported by: {report.user.first_name} {report.user.last_name}</p>
                                <p className="mb-2 text-sm">Date: {new Date(report.created_at).toLocaleDateString()}</p>
                                <p className="text-gray-600 dark:text-gray-300 font-semibold italic">"{report.text}"</p>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Alert>
                        <AlertTitle>No Reports</AlertTitle>
                        <AlertDescription>There are currently no reports for this article.</AlertDescription>
                    </Alert>
                )}
            </ScrollArea>
        </div>
    );
};

export default ArticleReportDetails;