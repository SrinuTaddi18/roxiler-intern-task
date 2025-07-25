import { Navigate } from 'react-router-dom';
import { getUser } from '../utils/auth';

export default function ProtectedRoute({ children, roles }) {
  const user = getUser();
  if (!user || (roles && !roles.includes(user.role))) {
    return <Navigate to="/login" />;
  }
  return children;
}
