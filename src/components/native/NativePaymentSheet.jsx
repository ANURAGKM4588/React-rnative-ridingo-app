import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Platform,
  Linking,
} from 'react-native';
import NativeIcon from './NativeIcon';
import { LightTheme, DarkTheme, Typography, Radii, Shadows } from '../../styles/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const PAYMENT_METHODS = [
  { id: 'upi', name: 'UPI Apps', sub: 'GPay, PhonePe, Paytm, BHIM', icon: 'qr' },
  { id: 'cash', name: 'Cash to Driver', sub: 'Pay in cash after ride completes', icon: 'wallet' },
  { id: 'card', name: 'Credit / Debit Card', sub: 'Visa, MasterCard, RuPay', icon: 'card' },
];

export default function NativePaymentSheet({
  visible = false,
  fare = 450,
  tripId,
  onClose,
  onPaymentSuccess,
  isDark = false,
}) {
  const theme = isDark ? DarkTheme : LightTheme;
  const [selectedMethod, setSelectedMethod] = useState('upi');

  const baseFare = Math.round(fare * 0.85);
  const gst = Math.round(fare * 0.10);
  const platformFee = fare - baseFare - gst;

  const handlePay = () => {
    if (selectedMethod === 'upi') {
      const vpa = 'ridingo@icici';
      const upiUrl = `upi://pay?pa=${vpa}&pn=Ridingo%20Services&am=${fare}&cu=INR&tn=Trip%20Payment%20${tripId || ''}`;
      Linking.canOpenURL(upiUrl)
        .then((supported) => {
          if (supported) {
            Linking.openURL(upiUrl);
          } else {
            // Intent fallback or web checkout
            Linking.openURL(upiUrl).catch(() => {});
          }
        })
        .catch(() => {});
    }

    if (onPaymentSuccess) {
      onPaymentSuccess({ method: selectedMethod, amount: fare });
    }
    if (onClose) onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.backdropTouch} activeOpacity={1} onPress={onClose} />

        <View style={[styles.sheetContent, { backgroundColor: theme.card }]}>
          <View style={styles.handleBar} />

          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: theme.ink }]}>Payment Summary</Text>
            <TouchableOpacity
              style={[styles.closeBtn, { backgroundColor: theme.surface }]}
              onPress={onClose}
            >
              <NativeIcon name="x" size={16} color={theme.ink} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollBody}>
            {/* Fare Breakdown Card */}
            <View style={[styles.breakdownCard, { backgroundColor: theme.surface }]}>
              <View style={styles.breakdownRow}>
                <Text style={[styles.breakdownLabel, { color: theme.muted }]}>Driver Base Rate</Text>
                <Text style={[styles.breakdownVal, { color: theme.ink }]}>₹{baseFare}</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={[styles.breakdownLabel, { color: theme.muted }]}>GST (10%)</Text>
                <Text style={[styles.breakdownVal, { color: theme.ink }]}>₹{gst}</Text>
              </View>
              <View style={styles.breakdownRow}>
                <Text style={[styles.breakdownLabel, { color: theme.muted }]}>Platform & Safety Fee</Text>
                <Text style={[styles.breakdownVal, { color: theme.ink }]}>₹{platformFee}</Text>
              </View>
              <View style={[styles.divider, { backgroundColor: theme.line }]} />
              <View style={styles.breakdownRow}>
                <Text style={[styles.totalLabel, { color: theme.ink }]}>Total Payable</Text>
                <Text style={[styles.totalVal, { color: theme.ink }]}>₹{fare}</Text>
              </View>
            </View>

            {/* Payment Method Options */}
            <Text style={[styles.sectionTitle, { color: theme.ink }]}>Select Payment Mode</Text>
            {PAYMENT_METHODS.map((method) => {
              const isSelected = selectedMethod === method.id;
              return (
                <TouchableOpacity
                  key={method.id}
                  style={[
                    styles.methodCard,
                    {
                      backgroundColor: isSelected ? theme.yellowSoft : theme.surface,
                      borderColor: isSelected ? theme.yellow : theme.line,
                    },
                  ]}
                  activeOpacity={0.85}
                  onPress={() => setSelectedMethod(method.id)}
                >
                  <View style={[styles.methodIconWrap, { backgroundColor: theme.card }]}>
                    <NativeIcon name={method.icon} size={20} color={theme.ink} />
                  </View>
                  <View style={styles.methodMeta}>
                    <Text style={[styles.methodName, { color: theme.ink }]}>{method.name}</Text>
                    <Text style={[styles.methodSub, { color: theme.muted }]}>{method.sub}</Text>
                  </View>
                  <View
                    style={[
                      styles.radioCircle,
                      {
                        borderColor: isSelected ? theme.yellow : theme.lineStrong,
                        backgroundColor: isSelected ? theme.yellow : 'transparent',
                      },
                    ]}
                  >
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Footer CTA */}
          <View style={[styles.footer, { borderTopColor: theme.line }]}>
            <TouchableOpacity
              style={[styles.payBtn, { backgroundColor: theme.solid }]}
              activeOpacity={0.88}
              onPress={handlePay}
            >
              <Text style={[styles.payBtnText, { color: theme.onSolid }]}>
                {selectedMethod === 'cash' ? `Confirm Cash Payment · ₹${fare}` : `Pay Now · ₹${fare}`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  backdropTouch: {
    flex: 1,
  },
  sheetContent: {
    borderTopLeftRadius: Radii.xl,
    borderTopRightRadius: Radii.xl,
    maxHeight: SCREEN_HEIGHT * 0.8,
    paddingTop: 10,
    ...Shadows.floating,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CCCCCC',
    alignSelf: 'center',
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  title: {
    ...Typography.title2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    paddingHorizontal: 20,
  },
  breakdownCard: {
    padding: 16,
    borderRadius: Radii.md,
    marginBottom: 18,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  breakdownLabel: {
    fontSize: 12.5,
  },
  breakdownVal: {
    fontSize: 13,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  totalVal: {
    fontSize: 18,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: Radii.md,
    borderWidth: 1.5,
    marginBottom: 10,
  },
  methodIconWrap: {
    width: 40,
    height: 40,
    borderRadius: Radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  methodMeta: {
    flex: 1,
  },
  methodName: {
    fontSize: 13.5,
    fontWeight: '700',
  },
  methodSub: {
    fontSize: 11,
    marginTop: 2,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#000000',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  payBtn: {
    height: 48,
    borderRadius: Radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payBtnText: {
    fontSize: 14.5,
    fontWeight: '750',
  },
});
