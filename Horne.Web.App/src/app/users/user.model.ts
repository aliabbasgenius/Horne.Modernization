export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Analyst' | 'Viewer';
  status: 'Active' | 'Invited' | 'Suspended';
  lastActive: string;
}
