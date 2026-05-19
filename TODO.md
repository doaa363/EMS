# HRM MERN Improvements - TODO

## Step 0 — Repo Baseline (done)
- Reviewed existing backend/frontend files: auth middleware, audit middleware, socket setup, skeleton component.

## Step 1 — Strict RBAC + Manager role
- [x] Update `backend/models/Employee.js` to support roles: `admin | manager | employee`
- [x] Add authorization middleware (`backend/middlewares/authorize.js`) 
- [x] Enforce RBAC on endpoints:
  - [x] `attendance/checkin`, `attendance/checkout`, `attendance/my-history` => employee+manager+admin
  - [x] `leaves/request` => employee+manager+admin
  - [x] `leaves/status/:id` => manager+admin only


## Step 2 — Real-time Dashboard (Socket.io)
- [ ] Add socket emitters in attendance/leave controllers on successful mutations
- [ ] Subscribe on frontend and update dashboard state

## Step 3 — Dashboard + Skeleton Loading
- [ ] Fetch initial dashboard data from API
- [ ] Use existing `frontend/src/components/Skeleton.jsx` for cards/charts/tables
- [ ] Replace static chart data with dynamic state updated by socket events

## Step 4 — Audit Logs (mutation-guaranteed)
- [ ] Redesign `backend/models/AuditLog.js` fields for clear operations
- [ ] Implement audit middleware that logs mutations reliably (after success)
- [ ] Ensure IP + performedBy details are captured
- [ ] Validate `/api/audit` returns newest logs

## Step 5 — Testing
- [ ] Test RBAC with employee token => must get 403
- [ ] Test manager/admin => allowed
- [ ] Test socket update => manager dashboard updates instantly
- [ ] Test skeleton => no layout shift
- [ ] Test audit => IP + details stored
