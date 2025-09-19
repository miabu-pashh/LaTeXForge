import React, { useState, useEffect } from "react";
import {
  Mail,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Search,
  Plus,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../CSS/EmailManagerDashboard.css";

// API service for backend communication
const emailService = {
  async getStats() {
    const response = await fetch("http://localhost:8080/api/emails/stats");
    return response.json();
  },

  async getEmails(page = 0, size = 20, category = null) {
    let url = `http://localhost:8080/api/emails?page=${page}&size=${size}`;
    if (category) url += `&category=${category}`;
    const response = await fetch(url);
    return response.json();
  },

  async getCategories() {
    const response = await fetch("http://localhost:8080/api/emails/categories");
    return response.json();
  },

  async getPendingReminders() {
    const response = await fetch("http://localhost:8080/api/reminders/pending");
    return response.json();
  },

  async getUpcomingReminders() {
    const response = await fetch(
      "http://localhost:8080/api/reminders/upcoming"
    );
    return response.json();
  },

  async fetchGmailEmails() {
    const response = await fetch(
      "http://localhost:8080/api/emails/fetch-gmail",
      {
        method: "POST",
      }
    );
    return response.json();
  },
};

const EmailManagerDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [emails, setEmails] = useState([]);
  const [categories, setCategories] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchingGmail, setFetchingGmail] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const sortEmailsByDate = (emailList) => {
    return [...emailList].sort((a, b) => {
      const dateA = new Date(a.receivedDate);
      const dateB = new Date(b.receivedDate);
      return dateB - dateA; // Newest first
    });
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, emailsData, categoriesData, remindersData] =
        await Promise.all([
          emailService.getStats(),
          emailService.getEmails(),
          emailService.getCategories(),
          emailService.getUpcomingReminders(),
        ]);

      setStats(statsData || {});
      const sortedEmails = sortEmailsByDate(emailsData.content || []);
      setEmails(sortedEmails);
      // Ensure categories is always an array
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setReminders(Array.isArray(remindersData) ? remindersData : []);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setStats({});
      setEmails([]);
      setCategories([]);
      setReminders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryFilter = async (category) => {
    setSelectedCategory(category);
    try {
      const emailsData = await emailService.getEmails(0, 20, category || null);
      const sortedEmails = sortEmailsByDate(emailsData.content || []);
      setEmails(sortedEmails);
    } catch (error) {
      console.error("Error filtering emails:", error);
      setEmails([]);
    }
  };

  const fetchGmailEmails = async () => {
    try {
      setFetchingGmail(true);
      const result = await emailService.fetchGmailEmails();
      console.log("Gmail fetch result:", result);

      if (result.success) {
        alert("Gmail emails fetched successfully!");
      } else {
        alert("Error fetching Gmail emails: " + result.message);
      }

      loadDashboardData();
    } catch (error) {
      console.error("Gmail fetch error:", error);
      alert("Error connecting to Gmail: " + error.message);
    } finally {
      setFetchingGmail(false);
    }
  };

  const getCategoryClassName = (category) => {
    const categoryMap = {
      INTERVIEW: "category-interview",
      ASSESSMENT: "category-assessment",
      JOB_APPLICATION: "category-job-application",
      FOLLOW_UP: "category-follow-up",
      OFFER: "category-offer",
      REJECTION: "category-rejection",
      GENERAL: "category-general",
      SPAM: "category-spam",
    };
    return categoryMap[category] || "category-general";
  };

  const getPriorityClassName = (priority) => {
    const priorityMap = {
      HIGH: "priority-high",
      MEDIUM: "priority-medium",
      LOW: "priority-low",
    };
    return priorityMap[priority] || "priority-medium";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const formatCategoryName = (category) => {
    return category ? category.replace(/_/g, " ") : "Unknown";
  };

  // Filter emails based on search term
  const filteredEmails = emails.filter((email) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      email.subject?.toLowerCase().includes(searchLower) ||
      email.sender?.toLowerCase().includes(searchLower) ||
      email.content?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="email-loading">
        <div className="email-spinner"></div>
      </div>
    );
  }

  const totalEmails = Object.values(stats.emailsByCategory || {}).reduce(
    (a, b) => a + b,
    0
  );
  const totalReminders = Object.values(stats.pendingReminders || {}).reduce(
    (a, b) => a + b,
    0
  );

  return (
    <div className="email-dashboard">
      {/* Navigation Back */}
      <div className="email-main-container">
        <button onClick={() => navigate(-1)} className="email-nav-back">
          <ArrowLeft className="email-nav-icon" />
          Back to Resume Manager
        </button>
      </div>

      {/* Header */}
      <div className="email-header">
        <div className="email-header-container">
          <div className="email-header-content">
            <div className="email-header-title">
              <Mail className="email-header-icon" />
              <h1 className="email-header-text">Email Manager</h1>
            </div>
            <div className="email-header-buttons">
              <button
                onClick={fetchGmailEmails}
                disabled={fetchingGmail}
                className={`email-btn ${
                  fetchingGmail ? "" : "email-btn-success"
                }`}
              >
                <Mail className="email-btn-icon" />
                {fetchingGmail ? "Fetching..." : "Fetch Gmail"}
              </button>
              <button className="email-btn email-btn-primary">
                <Plus className="email-btn-icon" />
                Add Email
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="email-main-container">
        {/* Info Banner */}
        <div className="email-info-banner">
          <Calendar className="email-info-icon" />
          <span className="email-info-text">
            Showing emails from the last 7 days • Total: {emails.length} emails
          </span>
        </div>

        {/* Stats Cards */}
        <div className="email-stats-grid">
          <div className="email-stat-card">
            <Mail className="email-stat-icon blue" />
            <div className="email-stat-content">
              <h3>Total Emails</h3>
              <p>{totalEmails}</p>
            </div>
          </div>

          <div className="email-stat-card">
            <Calendar className="email-stat-icon green" />
            <div className="email-stat-content">
              <h3>Interviews</h3>
              <p>{stats.emailsByCategory?.INTERVIEW || 0}</p>
            </div>
          </div>

          <div className="email-stat-card">
            <Clock className="email-stat-icon yellow" />
            <div className="email-stat-content">
              <h3>Pending Reminders</h3>
              <p>{totalReminders}</p>
            </div>
          </div>

          <div className="email-stat-card">
            <AlertCircle className="email-stat-icon red" />
            <div className="email-stat-content">
              <h3>Assessments</h3>
              <p>{stats.emailsByCategory?.ASSESSMENT || 0}</p>
            </div>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="email-main-layout">
          {/* Email List */}
          <div className="email-list-container">
            <div className="email-list-header">
              <h2 className="email-list-title">Recent Emails</h2>
              <div className="email-list-controls">
                <div className="email-search-container">
                  <Search className="email-search-icon" />
                  <input
                    type="text"
                    placeholder="Search emails..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="email-search-input"
                  />
                </div>

                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryFilter(e.target.value)}
                  className="email-category-select"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {formatCategoryName(category)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="email-list">
              {filteredEmails.length === 0 ? (
                <div className="email-empty-state">
                  <Mail className="email-empty-icon" />
                  <h3 className="email-empty-title">No emails found</h3>
                  <p className="email-empty-text">
                    {searchTerm
                      ? "Try adjusting your search terms or filters"
                      : "Get started by clicking 'Fetch Gmail' to import your emails"}
                  </p>
                </div>
              ) : (
                filteredEmails.map((email) => (
                  <div key={email.id} className="email-item">
                    <div className="email-item-content">
                      <div className="email-item-main">
                        <div className="email-item-tags">
                          <span
                            className={`email-category-tag ${getCategoryClassName(
                              email.category
                            )}`}
                          >
                            {formatCategoryName(email.category)}
                          </span>
                          <span
                            className={`email-priority ${getPriorityClassName(
                              email.priority
                            )}`}
                          >
                            {email.priority || "No Priority"}
                          </span>
                          {!email.read && (
                            <span className="email-unread-indicator"></span>
                          )}
                        </div>
                        <p className="email-subject">
                          {email.subject || "No Subject"}
                        </p>
                        <p className="email-sender">
                          From: {email.sender || "Unknown Sender"}
                        </p>
                        <p className="email-preview">
                          {email.content
                            ? email.content.substring(0, 100) + "..."
                            : "No content"}
                        </p>
                      </div>
                      <div className="email-date">
                        {formatDate(email.receivedDate)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="email-sidebar">
            {/* Reminders Section */}
            <div className="email-sidebar-section">
              <div className="email-sidebar-header">
                <h2 className="email-sidebar-title">Upcoming Reminders</h2>
              </div>
              <div className="email-sidebar-content">
                {reminders.length === 0 ? (
                  <div className="email-empty-state">
                    <CheckCircle className="email-empty-icon" />
                    <p className="email-empty-text">No upcoming reminders</p>
                  </div>
                ) : (
                  <div className="email-reminders-list">
                    {reminders.slice(0, 5).map((reminder) => (
                      <div key={reminder.id} className="email-reminder-item">
                        <p className="email-reminder-title">
                          {reminder.title || "No Title"}
                        </p>
                        <p className="email-reminder-date">
                          {formatDate(reminder.eventDateTime)}
                        </p>
                        <span className="email-reminder-type">
                          {formatCategoryName(reminder.type)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Categories Section */}
            <div className="email-sidebar-section">
              <div className="email-sidebar-header">
                <h2 className="email-sidebar-title">Email Categories</h2>
              </div>
              <div className="email-sidebar-content">
                <div className="email-categories-list">
                  {Object.entries(stats.emailsByCategory || {}).map(
                    ([category, count]) => (
                      <div key={category} className="email-category-item">
                        <span
                          className={`email-category-tag ${getCategoryClassName(
                            category
                          )}`}
                        >
                          {formatCategoryName(category)}
                        </span>
                        <span className="email-category-count">{count}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailManagerDashboard;
