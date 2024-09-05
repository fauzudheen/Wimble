import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import createAxiosInstance from '../../../api/axiosInstance';
import { useSelector } from 'react-redux';
import { GatewayUrl } from '../../const/urls';
import { Card, CardContent, CardHeader, CardTitle } from '../../UIComponents';
import { Alert, AlertDescription, AlertTitle } from '../../UIComponents';
import { ScrollArea } from '../../UIComponents';
import Buttons from '../../user/misc/Buttons';

const ArticleReports = () => {
    const [reports, setReports] = useState([]);
    const [groupedReports, setGroupedReports] = useState({});
    const token = useSelector((state) => state.auth.adminAccess);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const axiosInstance = createAxiosInstance(token);
                const response = await axiosInstance.get(`${GatewayUrl}api/article-reports/`);
                setReports(response.data);

                // Group reports by article
                const grouped = response.data.reduce((acc, report) => {
                    const articleId = report.article.id;
                    if (!acc[articleId]) {
                        acc[articleId] = {
                            article: report.article,
                            reports: []
                        };
                    }
                    acc[articleId].reports.push(report);
                    return acc;
                }, {});

                // Sort articles by number of reports
                const sortedGrouped = Object.values(grouped).sort((a, b) => b.reports.length - a.reports.length);
                setGroupedReports(sortedGrouped);
            } catch (error) {
                console.error('Error fetching reports:', error);
            }
        };

        fetchReports();
    }, [token]);

    const handleViewReports = (articleId) => {
        navigate(`/admin/articles/${articleId}/reports`);
    };

    return (
        <div className="container mx-auto py-6 px-4 bg-transparent text-gray-800 dark:text-white min-h-screen">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold bg-black dark:text-white bg-clip-text text-transparent">
                    Article Reports
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
                    groupedReports.map(({ article, reports }) => (
                        <Card key={article.id} className="mb-4 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold">Title: {article.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 dark:text-gray-400 mb-2">Reports: {reports.length}</p>
                                <button 
                                    className="mr-2 text-sm bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-500 hover:to-teal-500 dark:from-teal-500 dark:to-teal-700 dark:hover:from-teal-500 dark:hover:to-teal-600 text-white font-semibold py-2 px-4 rounded-md shadow"
                                    onClick={() => navigate(`/admin/articles/${article.id}`)}
                                >
                                    Read Article
                                </button>
                                <button 
                                    // className="bg-gradient-to-r from-teal-500 mr-2 text-sm to-blue-600 hover:from-teal-500 hover:to-blue-500 dark:from-teal-500 dark:to-blue-700 dark:hover:from-teal-500 dark:hover:to-blue-600 text-white font-semibold py-2 px-4 rounded-md shadow"
                                    className={`${Buttons.tealBlueGradientOutlineButton}`}
                                    onClick={() => handleViewReports(article.id)}
                                >
                                    View Reports
                                </button>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Alert className="bg-gray-100 dark:bg-gray-800 border-teal-500 dark:border-teal-500">
                        <AlertTitle className="text-teal-500 dark:text-teal-400">No Reports</AlertTitle>
                        <AlertDescription>There are currently no reports for any articles.</AlertDescription>
                    </Alert>
                )}
            </ScrollArea>
        </div>
    );
};

export default ArticleReports;