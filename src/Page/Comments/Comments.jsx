import { useState, useEffect } from "react";
import { commentsApi } from "../../services/api";
import {
  FiMessageSquare, FiCheck, FiX, FiTrash2, FiSearch,
  FiFilter, FiChevronDown, FiChevronRight, FiCornerDownRight,
  FiClock, FiAlertCircle, FiCheckCircle, FiMail,
  FiMoreVertical, FiFlag, FiEye, FiRefreshCw,
} from "react-icons/fi";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";

const MOCK_DATA = [
  {
    postId: 1,
    postTitle: "Ultimate MERN Stack Roadmap 2026",
    postSlug: "mern-stack-roadmap-2026",
    postDate: "May 28, 2026",
    comments: [
      { id: 1, author: "Rahul Sharma", email: "rahul@example.com", avatar: "RS", avatarColor: "#E8663D", body: "This is exactly what I needed! The roadmap is super clear and the order makes sense. Starting with Node.js first was a great suggestion.", date: "2h ago", status: "pending", replies: [] },
      { id: 2, author: "Priya Singh", email: "priya@techie.io", avatar: "PS", avatarColor: "#3B82F6", body: "Great article but I think you should also mention TypeScript with MERN. It's becoming the standard in 2026.", date: "5h ago", status: "approved", replies: [
        { id: 21, author: "Admin", email: "admin@kraviona.com", avatar: "KV", avatarColor: "#E8663D", body: "Great point Priya! We'll add a TypeScript section in the next update. Stay tuned!", date: "4h ago", isAdmin: true }
      ]},
      { id: 3, author: "spammer99", email: "buy@cheap-stuff.com", avatar: "SP", avatarColor: "#94A3B8", body: "Buy cheap hosting at superhosting.xyz click here now!!!", date: "1h ago", status: "spam", replies: [] },
    ],
  },
  {
    postId: 2,
    postTitle: "10 Benefits of AI in Web Development",
    postSlug: "10-benefits-of-ai-web-dev",
    postDate: "May 20, 2026",
    comments: [
      { id: 4, author: "Amit Patel", email: "amit@devworks.in", avatar: "AP", avatarColor: "#10B981", body: "Point #7 about AI-assisted code review is underrated. We implemented it at our startup and reduced bugs by 40%.", date: "1d ago", status: "approved", replies: [] },
      { id: 5, author: "Sara Khan", email: "sara.k@gmail.com", avatar: "SK", avatarColor: "#8B5CF6", body: "I disagree with point #3. AI still struggles with complex business logic. It's not as powerful as you're suggesting.", date: "2d ago", status: "pending", replies: [] },
      { id: 6, author: "Vikram Nair", email: "v.nair@outlook.com", avatar: "VN", avatarColor: "#F59E0B", body: "Can you write a follow-up article on how to integrate GitHub Copilot into a MERN project? Would be super helpful!", date: "2d ago", status: "approved", replies: [
        { id: 61, author: "Admin", email: "admin@kraviona.com", avatar: "KV", avatarColor: "#E8663D", body: "Great idea Vikram! It's in our content calendar for June. Subscribe to the newsletter to get notified.", date: "2d ago", isAdmin: true }
      ]},
    ],
  },
  {
    postId: 3,
    postTitle: "Technical SEO Checklist for Developers",
    postSlug: "technical-seo-checklist",
    postDate: "May 10, 2026",
    comments: [
      { id: 7, author: "Neha Gupta", email: "neha.g@seolab.com", avatar: "NG", avatarColor: "#06B6D4", body: "This checklist is gold. Bookmarked it and shared it with my entire dev team. The Core Web Vitals section is especially actionable.", date: "3d ago", status: "approved", replies: [] },
    ],
  },
];

const STATUS_CONFIG = {
  pending:  { label: "Pending",  bg: "bg-amber-50",   text: "text-amber-600",  dot: "bg-amber-400",  icon: FiClock },
  approved: { label: "Approved", bg: "bg-emerald-50", text: "text-emerald-600",dot: "bg-emerald-500", icon: FiCheckCircle },
  spam:     { label: "Spam",     bg: "bg-red-50",     text: "text-red-500",    dot: "bg-red-400",    icon: FiAlertCircle },
};

function Avatar({ initials, color, size = "sm" }) {
  const sz = size === "sm" ? "w-8 h-8 text-xs" : "w-9 h-9 text-xs";
  return (
    <div className={`${sz} rounded-full flex items-center justify-center font-bold text-white shrink-0`} style={{ background: color }}>
      {initials}
    </div>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status];
  if (!cfg) return null;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function ReplyBox({ onSubmit, onCancel }) {
  const [text, setText] = useState("");
  return (
    <div className="mt-3 pl-4 border-l-2 border-[#E8663D]/30">
      <textarea
        rows={3}
        className="w-full text-sm border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all resize-none"
        placeholder="Write a reply as Admin..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => { if (text.trim()) { onSubmit(text); setText(""); } }}
          className="px-4 py-1.5 text-xs font-semibold text-white rounded-lg transition-all hover:shadow active:scale-95"
          style={{ background: "linear-gradient(135deg,#E8663D,#d45a30)" }}
        >
          Post Reply
        </button>
        <button onClick={onCancel} className="px-4 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
          Cancel
        </button>
      </div>
    </div>
  );
}

function CommentCard({ comment, onApprove, onReject, onDelete, onReply, onSpam }) {
  const [showReply, setShowReply] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const cfg = STATUS_CONFIG[comment.status] || STATUS_CONFIG.pending;

  return (
    <div className={`rounded-xl border transition-all ${
      comment.status === "spam" ? "border-red-100 bg-red-50/30" :
      comment.status === "pending" ? "border-amber-100 bg-amber-50/20" :
      "border-gray-100 bg-white"
    } p-4 group`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <Avatar initials={comment.avatar} color={comment.avatarColor} />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-gray-800 text-sm">{comment.author}</span>
              <StatusBadge status={comment.status} />
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <FiMail size={11} className="text-gray-400" />
              <span className="text-xs text-gray-400">{comment.email}</span>
              <span className="text-gray-300">·</span>
              <FiClock size={11} className="text-gray-400" />
              <span className="text-xs text-gray-400">{comment.date}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 shrink-0">
          {comment.status === "pending" && (
            <>
              <button onClick={() => onApprove(comment.id)} title="Approve" className="p-1.5 hover:bg-emerald-50 rounded-lg transition-colors text-gray-400 hover:text-emerald-600">
                <FiCheck size={14} />
              </button>
              <button onClick={() => onReject(comment.id)} title="Reject" className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-500">
                <FiX size={14} />
              </button>
            </>
          )}
          {comment.status !== "spam" && (
            <button onClick={() => setShowReply(!showReply)} title="Reply" className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors text-gray-400 hover:text-blue-500">
              <FiCornerDownRight size={14} />
            </button>
          )}
          <button onClick={() => onSpam(comment.id)} title="Mark spam" className="p-1.5 hover:bg-orange-50 rounded-lg transition-colors text-gray-400 hover:text-orange-500">
            <FiFlag size={14} />
          </button>
          <button onClick={() => onDelete(comment.id)} title="Delete" className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-500">
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>

      {/* Body */}
      <p className="text-sm text-gray-700 mt-3 leading-relaxed pl-11">{comment.body}</p>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 pl-11 space-y-3">
          {comment.replies.map((r) => (
            <div key={r.id} className="flex items-start gap-3 bg-[#FFF7F4] border border-orange-100 rounded-xl p-3">
              <Avatar initials={r.avatar} color={r.avatarColor} size="sm" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-800 text-xs">{r.author}</span>
                  {r.isAdmin && (
                    <span className="px-1.5 py-0.5 bg-[#E8663D] text-white text-[10px] font-bold rounded-md">Admin</span>
                  )}
                  <span className="text-[11px] text-gray-400">{r.date}</span>
                </div>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{r.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply Box */}
      {showReply && (
        <div className="pl-11">
          <ReplyBox
            onSubmit={(text) => { onReply(comment.id, text); setShowReply(false); }}
            onCancel={() => setShowReply(false)}
          />
        </div>
      )}
    </div>
  );
}

function PostGroup({ group, filterStatus, onApprove, onReject, onDelete, onReply, onSpam }) {
  const [collapsed, setCollapsed] = useState(false);

  const filteredComments = group.comments.filter((c) =>
    filterStatus === "all" ? true : c.status === filterStatus
  );
  if (filteredComments.length === 0) return null;

  const pendingCount = group.comments.filter((c) => c.status === "pending").length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Post Header */}
      <button
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50/60 transition-colors text-left"
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-[#FFF4F0] flex items-center justify-center shrink-0">
            <FiMessageSquare size={16} className="text-[#E8663D]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-800 text-sm">{group.postTitle}</span>
              {pendingCount > 0 && (
                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[11px] font-bold rounded-full">
                  {pendingCount} pending
                </span>
              )}
            </div>
            <span className="text-xs text-gray-400">/blog/{group.postSlug} · {group.postDate}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-gray-400 hidden sm:block">
            {filteredComments.length} comment{filteredComments.length !== 1 ? "s" : ""}
          </span>
          {collapsed ? <FiChevronRight size={16} className="text-gray-400" /> : <FiChevronDown size={16} className="text-gray-400" />}
        </div>
      </button>

      {/* Comments */}
      {!collapsed && (
        <div className="px-5 pb-5 space-y-3 border-t border-gray-50">
          <div className="pt-3" />
          {filteredComments.map((c) => (
            <CommentCard
              key={c.id}
              comment={c}
              onApprove={onApprove}
              onReject={onReject}
              onDelete={onDelete}
              onReply={onReply}
              onSpam={onSpam}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CommentsPage() {
  const [data, setData] = useState(MOCK_DATA);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    commentsApi.list({ limit: 200 }).then((res) => {
      const list = Array.isArray(res) ? res : (res?.data || []);
      if (list.length > 0) {
        // Group by postId / postTitle
        const groups = {};
        list.forEach((c) => {
          const k = c.postId || c.postSlug || "ungrouped";
          if (!groups[k]) groups[k] = {
            postId: c.postId, postTitle: c.postTitle || c.postSlug || "Uncategorised",
            postSlug: c.postSlug, postDate: c.postDate || "", comments: [],
          };
          groups[k].comments.push({
            id: c._id, author: c.author || c.name, email: c.email,
            avatar: (c.author || c.name || "?").split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase(),
            avatarColor: "#3B82F6", body: c.body || c.content,
            date: c.createdAt, status: c.status || "pending", replies: c.replies || [],
          });
        });
        setData(Object.values(groups));
      }
    }).catch(() => null);
  }, []);

  const allComments = data.flatMap((g) => g.comments);
  const counts = {
    all: allComments.length,
    pending: allComments.filter((c) => c.status === "pending").length,
    approved: allComments.filter((c) => c.status === "approved").length,
    spam: allComments.filter((c) => c.status === "spam").length,
  };

  const updateComment = (id, patch) => {
    setData(data.map((g) => ({
      ...g,
      comments: g.comments.map((c) => c.id === id ? { ...c, ...patch } : c),
    })));
    commentsApi.update(id, patch).catch(() => null);
  };

  const deleteComment = (id) => {
    setData(data.map((g) => ({ ...g, comments: g.comments.filter((c) => c.id !== id) })));
    commentsApi.remove(id).catch(() => null);
  };

  const replyToComment = (id, text) => {
    setData(data.map((g) => ({
      ...g,
      comments: g.comments.map((c) =>
        c.id === id
          ? { ...c, replies: [...(c.replies || []), { id: Date.now(), author: "Admin", email: "admin@kraviona.com", avatar: "KV", avatarColor: "#E8663D", body: text, date: "just now", isAdmin: true }] }
          : c
      ),
    })));
  };

  const filteredData = data
    .map((g) => ({
      ...g,
      comments: g.comments.filter((c) => {
        const matchSearch = !search || c.author.toLowerCase().includes(search.toLowerCase()) || c.body.toLowerCase().includes(search.toLowerCase());
        return matchSearch;
      }),
    }))
    .filter((g) => g.comments.length > 0);

  return (
    <div className="min-h-screen bg-[#F7F8FA] font-sans">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-0.5">
            <span>Blog Engine</span>
            <span>/</span>
            <span className="text-gray-700 font-medium">Comments</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <HiOutlineChatBubbleLeftRight size={20} className="text-[#E8663D]" />
            Comments
          </h1>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium">
          <FiRefreshCw size={14} />
          Refresh
        </button>
      </div>

      <div className="px-6 py-6 max-w-[960px] mx-auto space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { key: "all",      label: "Total",    color: "#6366F1", bg: "#EEF2FF" },
            { key: "pending",  label: "Pending",  color: "#F59E0B", bg: "#FFFBEB" },
            { key: "approved", label: "Approved", color: "#10B981", bg: "#F0FDF4" },
            { key: "spam",     label: "Spam",     color: "#EF4444", bg: "#FEF2F2" },
          ].map(({ key, label, color, bg }) => (
            <button
              key={key}
              onClick={() => setFilterStatus(key)}
              className={`rounded-2xl px-5 py-4 flex items-center gap-3 shadow-sm transition-all text-left ${
                filterStatus === key ? "ring-2 ring-offset-1" : "bg-white hover:shadow-md"
              }`}
              style={{ background: filterStatus === key ? bg : undefined, ringColor: color }}
            >
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg }}>
                <FiMessageSquare size={16} style={{ color }} />
              </div>
              <div>
                <div className="text-xl font-bold text-gray-800">{counts[key]}</div>
                <div className="text-xs text-gray-400">{label}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Search + Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="relative flex-1">
            <FiSearch size={14} className="absolute left-3.5 top-3 text-gray-400" />
            <input
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100 transition-all shadow-sm"
              placeholder="Search by author or content..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            {["all", "pending", "approved", "spam"].map((f) => (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                  filterStatus === f ? "bg-[#E8663D] text-white shadow-sm" : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {f} {counts[f] > 0 && <span className="ml-1 opacity-70">{counts[f]}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Approve All Pending CTA */}
        {counts.pending > 0 && filterStatus !== "spam" && (
          <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-5 py-3">
            <div className="flex items-center gap-2 text-amber-700 text-sm">
              <FiClock size={15} />
              <span><strong>{counts.pending} comments</strong> waiting for approval</span>
            </div>
            <button
              onClick={() => {
                setData(data.map((g) => ({
                  ...g,
                  comments: g.comments.map((c) => c.status === "pending" ? { ...c, status: "approved" } : c),
                })));
              }}
              className="text-xs font-semibold text-amber-700 hover:text-amber-900 underline underline-offset-2 transition-colors"
            >
              Approve all
            </button>
          </div>
        )}

        {/* Post Groups */}
        {filteredData.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center">
            <HiOutlineChatBubbleLeftRight size={40} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-400 text-sm">No comments found</p>
          </div>
        ) : (
          filteredData.map((g) => (
            <PostGroup
              key={g.postId}
              group={g}
              filterStatus={filterStatus}
              onApprove={(id) => updateComment(id, { status: "approved" })}
              onReject={(id) => updateComment(id, { status: "draft" })}
              onDelete={deleteComment}
              onReply={replyToComment}
              onSpam={(id) => updateComment(id, { status: "spam" })}
            />
          ))
        )}
      </div>
    </div>
  );
}