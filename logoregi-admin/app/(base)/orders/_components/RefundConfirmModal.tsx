'use client';

import { useState } from 'react';
import { Order } from '@/types/Order';

type RefundConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  onSuccess: () => void;
};

export function RefundConfirmModal({ isOpen, onClose, order, onSuccess }: RefundConfirmModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleRefund = async () => {
    if (!order.paymentId) {
      setErrorMessage('支払いIDが見つかりません');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const { useRefundPayment } = await import('@/query/refundPayment');
      const refundPaymentMutation = useRefundPayment();
      await refundPaymentMutation.mutateAsync(order.paymentId);
      
      console.log('返金処理が完了しました');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('返金処理エラー:', error);
      setErrorMessage(error instanceof Error ? error.message : '不明なエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;
  
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '0.375rem',
          width: 'auto',
          minWidth: '28rem',
          maxWidth: '90%',
          maxHeight: '90%',
          overflow: 'auto',
        }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <div style={{ padding: '1rem', fontWeight: 'bold', borderBottomWidth: '1px', borderBottomStyle: 'solid', borderColor: '#E2E8F0' }}>
          返金確認
        </div>
        <div style={{ padding: '1rem' }}>
          <div style={{ marginBottom: '1rem' }}>以下の注文を返金します。よろしいですか？</div>
          <div style={{ padding: '1rem', backgroundColor: '#F7FAFC', borderRadius: '0.375rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ fontWeight: 'bold' }}>注文ID:</div>
              <div>{order.id}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div style={{ fontWeight: 'bold' }}>注文タイプ:</div>
              <div>{order.orderType === 'EatIn' ? 'イートイン' : 'テイクアウト'}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ fontWeight: 'bold' }}>合計金額:</div>
              <div>{order.totalAmount}円</div>
            </div>
          </div>
          {errorMessage && (
            <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#FFF5F5', color: '#E53E3E', borderRadius: '0.375rem' }}>
              {errorMessage}
            </div>
          )}
          <div style={{ marginTop: '1rem', color: '#E53E3E' }}>
            この操作は取り消せません。また、当日中の注文のみ返金可能です。
          </div>
        </div>
        <div style={{ padding: '1rem', borderTopWidth: '1px', borderTopStyle: 'solid', borderColor: '#E2E8F0' }}>
          <div style={{ display: 'flex', width: '100%', gap: '0.75rem' }}>
            <button 
              style={{ 
                flex: 1, 
                padding: '0.5rem 1rem', 
                borderRadius: '0.375rem', 
                border: '1px solid #CBD5E0',
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
              onClick={onClose}
              disabled={isLoading}
            >
              キャンセル
            </button>
            <button 
              style={{ 
                flex: 1, 
                padding: '0.5rem 1rem', 
                borderRadius: '0.375rem', 
                backgroundColor: '#E53E3E',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                opacity: isLoading ? 0.7 : 1
              }}
              onClick={handleRefund}
              disabled={isLoading}
            >
              {isLoading ? '処理中...' : '返金する'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
