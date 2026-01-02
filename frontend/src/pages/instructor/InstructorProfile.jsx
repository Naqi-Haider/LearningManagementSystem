import { useState, useRef } from 'react';
import MainLayout from '../../components/MainLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const InstructorProfile = () => {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: user?.name || '' });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      if (selectedImage) {
        formDataToSend.append('profileImage', selectedImage);
      }

      const { data } = await api.put('/auth/profile', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUser({ ...user, name: data.name, profileImage: data.profileImage });
      setEditing(false);
      setSelectedImage(null);
      setImagePreview(null);
      setMessage('Profile updated successfully');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({ name: user.name });
    setSelectedImage(null);
    setImagePreview(null);
  };

  const displayImage = imagePreview || user?.profileImage;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Instructor Profile</h1>
          <p className="text-sm text-gray-500">Manage your account settings</p>
        </div>

        {message && (
          <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-error'}`}>
            {message}
          </div>
        )}

        <div className="card p-6">
          {editing ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div
                  className="w-20 h-20 rounded-full bg-gray-900 text-white flex items-center justify-center text-2xl font-medium overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {displayImage ? (
                    <img src={displayImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user?.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-secondary btn-sm"
                  >
                    Change Photo
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF up to 2MB</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="input bg-gray-100 cursor-not-allowed"
                  value={user?.email}
                  disabled
                  readOnly
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
              <div className="flex gap-2">
                <button onClick={handleSave} className="btn btn-primary btn-sm" disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={handleCancel} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gray-900 text-white flex items-center justify-center text-2xl font-medium overflow-hidden">
                  {user?.profileImage ? (
                    <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    user?.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                    {user?.role}
                  </span>
                </div>
              </div>
              <button onClick={() => setEditing(true)} className="btn btn-secondary btn-sm">
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default InstructorProfile;
