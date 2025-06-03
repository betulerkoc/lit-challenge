.card-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 12px;
}
.employee-card {
  display: flex;
  align-items: flex-start;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08), 0 1.5px 4px rgba(0,0,0,0.04);
  padding: 28px 32px;
  gap: 32px;
  border: 1px solid #f0f0f0;
  transition: box-shadow 0.2s, transform 0.2s;
  position: relative;
}
.employee-card:hover {
  box-shadow: 0 8px 24px rgba(255,102,0,0.10), 0 2px 8px rgba(0,0,0,0.06);
  transform: translateY(-2px) scale(1.01);
}
.card-checkbox {
  margin-right: 18px;
  margin-top: 4px;
}
.card-details {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 18px 36px;
}
.card-field {
  min-width: 180px;
  color: #222;
  font-size: 16px;
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid #f6f6f6;
}
.card-label {
  color: #ff6600;
  font-weight: 600;
  margin-right: 4px;
}
.card-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-left: 16px;
  align-items: center;
  justify-content: flex-start;
} 