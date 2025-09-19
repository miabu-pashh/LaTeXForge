// EmailStatsWidget.js
import React, { useState, useEffect } from "react";
import { Mail, Calendar, Clock, AlertCircle } from "lucide-react";

const EmailStatsWidget = ({ onStatsUpdate }) => {
  const [stats, setStats] = useState({});
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [statsResponse, remindersResponse] = await Promise.all([
        fetch("http://localhost:8080/api/emails/stats"),
        fetch("http://localhost:8080/api/reminders/upcoming"),
      ]);

      const statsData = await statsResponse.json();
      const remindersData = await remindersResponse.json();

      setStats(statsData || {});
      setReminders(Array.isArray(remindersData) ? remindersData : []);

      if (onStatsUpdate) {
        onStatsUpdate({ stats: statsData, reminders: remindersData });
      }
    } catch (error) {
      console.error("Error loading email stats:", error);
      setStats({});
      setReminders([]);
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="email-stats-loading">
        <div className="spinner"></div>
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
    <div className="emailStatsWidget">
      <h3 className="emailStatsTitle"> Gmail Overview</h3>

      {/* Stats Cards */}
      <div className="emailStatsGrid">
        <div className="emailStatCard">
          <Mail className="emailStatIcon blue" />
          <div className="emailStatContent">
            <span className="emailStatNumber">{totalEmails}</span>
            <span className="emailStatLabel">Total Emails</span>
          </div>
        </div>

        <div className="emailStatCard">
          <Calendar className="emailStatIcon green" />
          <div className="emailStatContent">
            <span className="emailStatNumber">
              {stats.emailsByCategory?.INTERVIEW || 0}
            </span>
            <span className="emailStatLabel">Interviews</span>
          </div>
        </div>

        <div className="emailStatCard">
          <Clock className="emailStatIcon yellow" />
          <div className="emailStatContent">
            <span className="emailStatNumber">{totalReminders}</span>
            <span className="emailStatLabel">Pending Reminders</span>
          </div>
        </div>

        <div className="emailStatCard">
          <AlertCircle className="emailStatIcon red" />
          <div className="emailStatContent">
            <span className="emailStatNumber">
              {stats.emailsByCategory?.ASSESSMENT || 0}
            </span>
            <span className="emailStatLabel">Assessments</span>
          </div>
        </div>
      </div>

      {/* Upcoming Reminders */}
      {reminders.length > 0 && (
        <div className="emailRemindersSection">
          <h4 className="emailRemindersTitle">🔔 Upcoming Reminders</h4>
          <div className="emailRemindersList">
            {reminders.slice(0, 3).map((reminder) => (
              <div key={reminder.id} className="emailReminderItem">
                <div className="emailReminderContent">
                  <span className="emailReminderTitle">
                    {reminder.title || "No Title"}
                  </span>
                  <span className="emailReminderDate">
                    {formatDate(reminder.eventDateTime)}
                  </span>
                </div>
                <span className="emailReminderType">
                  {reminder.type ? reminder.type.replace(/_/g, " ") : "Unknown"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={loadStats}
        className="emailRefreshBtn"
        disabled={loading}
      >
        {loading ? "Refreshing..." : "🔄 Refresh"}
      </button>
    </div>
  );
};

export default EmailStatsWidget;
