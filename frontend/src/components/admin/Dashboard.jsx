import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, FileText, Users2, Building2, CreditCard, TrendingUp, Activity, Search, ChevronDown } from 'lucide-react';
import createAxiosInstance from '../../api/axiosInstance';
import { GatewayUrl } from '../const/urls';

const Dashboard = () => {
  const token = useSelector((state) => state.auth.adminAccess);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const axiosInstance = createAxiosInstance(token);
        const response = await axiosInstance.get(`${GatewayUrl}/api/fetchall/`);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
        setLoading(false);
      }
    };

    fetchAllData();
  }, [token]);

  if (loading) return <div className="flex justify-center items-center h-screen"><Activity className="animate-spin h-8 w-8 text-blue-500" /></div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
  if (!data) return null;

  const userCount = data.users.length;
  const articleCount = data.articles.length;
  const communityCount = data.communities.length;
  const teamCount = data.teams.length;
  const paymentCount = data.payments.length;

  const userTiers = data.users.reduce((acc, user) => {
    acc[user.account_tier] = (acc[user.account_tier] || 0) + 1;
    return acc;
  }, {});

  const userTierData = Object.entries(userTiers).map(([tier, count]) => ({
    name: tier,
    value: count
  }));

  const articleData = data.articles.map(article => ({
    title: article.title.substring(0, 20) + (article.title.length > 20 ? '...' : ''),
    likes: article.likes_count,
    comments: article.comments_count
  }));

  const revenueData = data.payments.reduce((acc, payment) => {
    const date = new Date(payment.created_at).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 500; // Assuming each payment is ₹500
    return acc;
  }, {});

  const revenueChartData = Object.entries(revenueData).map(([date, amount]) => ({
    date,
    amount
  }));

  const totalRevenue = Object.values(revenueData).reduce((sum, amount) => sum + amount, 0);

  const StatCard = ({ title, value, icon: Icon, trend }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-3xl font-semibold text-gray-700 dark:text-white">{value}</p>
        </div>
        <Icon className="h-8 w-8 text-blue-500" />
      </div>
      {trend && (
        <div className={`text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
        </div>
      )}
    </div>
  );

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const sortedArticles = [...data.articles].sort((a, b) => {
    if (sortConfig.key) {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredArticles = sortedArticles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.user_data.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.user_data.last_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'ascending' ? 'descending' : 'ascending',
    }));
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8 text-gray-800 dark:text-white text-center">Admin Dashboard</h1>
      
      <div className="mb-8">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 font-semibold rounded ${activeTab === 'overview' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 font-semibold rounded ${activeTab === 'articles' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('articles')}
          >
            Articles
          </button>
          <button
            className={`px-4 py-2 font-semibold rounded ${activeTab === 'revenue' ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setActiveTab('revenue')}
          >
            Revenue
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
        {/* Stat cards trend data is dummy */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
            <StatCard title="Total Users" value={userCount} icon={Users} />
            <StatCard title="Total Articles" value={articleCount} icon={FileText} />
            <StatCard title="Communities" value={communityCount} icon={Users2}/>
            <StatCard title="Teams" value={teamCount} icon={Building2} />
            <StatCard title="Payments" value={paymentCount} icon={CreditCard} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">User Account Tiers</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userTierData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {userTierData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Article Engagement</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={articleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" tick={false} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="likes" fill="#8884d8" />
                  <Bar dataKey="comments" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {activeTab === 'articles' && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Articles</h2>
          <div className="mb-4 flex items-center">
            <Search className="h-5 w-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search articles..."
              className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  {['Title', 'Author', 'Likes', 'Comments', 'Created At'].map(header => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort(header.toLowerCase().replace(' ', '_'))}
                    >
                      <div className="flex items-center">
                        {header}
                        <ChevronDown className="h-4 w-4 ml-1" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredArticles.map((article, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {article.title.length > 30 ? `${article.title.slice(0, 30)}...` : article.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {`${article.user_data.first_name} ${article.user_data.last_name}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {article.likes_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {article.comments_count}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(article.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'revenue' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Revenue Over Time</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Revenue Statistics</h2>
            <div className="grid grid-cols-2 gap-4">
              <StatCard title="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} icon={TrendingUp} />
              <StatCard title="Avg. Revenue per User" value={`₹${(totalRevenue / userCount).toFixed(2)}`} icon={Users} />
              <StatCard title="Premium Users" value={userTiers['premium'] || 0} icon={CreditCard} />
              <StatCard title="Conversion Rate" value={`${((userTiers['premium'] || 0) / userCount * 100).toFixed(2)}%`} icon={TrendingUp} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;