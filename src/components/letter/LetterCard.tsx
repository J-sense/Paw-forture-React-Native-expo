import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { LetterItem } from "./LetterItem";

interface LetterCardProps {
  item: LetterItem;
  onPress?: (item: LetterItem) => void;
}

export const LetterCard: React.FC<LetterCardProps> = ({ item, onPress }) => {
  const isOpened = item.status === "opened";

  const getBgColor = (bgColor?: string) => {
    if (bgColor?.startsWith("#")) return bgColor;
    switch (bgColor) {
      case "bg-amber-50":
        return "#FFFBEB";
      case "bg-[#FFFDF8]":
      case "bg-yellow-50":
        return "#FEFCE8";
      case "bg-pink-50":
        return "#FDF2F8";
      case "bg-orange-50":
        return "#FFF7ED";
      case "bg-sky-50":
        return "#F0F9FF";
      case "bg-rose-50":
        return "#FFF1F2";
      case "bg-indigo-50":
        return "#EEF2FF";
      default:
        return isOpened ? "#F4FBF7" : "#FFF5F5";
    }
  };

  if (!isOpened) {
    // ══════════════════════════════════════════════════════════════════
    // 1. PENDING / UNOPENED LETTER CARD (Sealed Envelope Airmail Theme)
    // ══════════════════════════════════════════════════════════════════
    return (
      <TouchableOpacity
        onPress={() => onPress?.(item)}
        activeOpacity={0.88}
        style={[styles.cardBase, styles.pendingCard]}
      >
        {/* Top Decorative Airmail Strip */}
        <View style={styles.airmailStrip}>
          <View style={[styles.airmailDot, { backgroundColor: "#F43F5E" }]} />
          <View style={[styles.airmailDot, { backgroundColor: "#FBBF24" }]} />
          <View style={[styles.airmailDot, { backgroundColor: "#38BDF8" }]} />
          <Text style={styles.sealedTagText}>💌 待拆封時空信件 ・ SEALED LETTER</Text>
        </View>

        <View style={styles.cardInnerRow}>
          {/* Left Icon with Wax-Seal / Notification Styling */}
          <View
            style={[
              styles.iconBox,
              styles.pendingIconBox,
              { backgroundColor: getBgColor(item.bgColor) },
            ]}
          >
            <Text style={styles.iconEmoji}>{item.icon}</Text>
            {/* Unread Red Notification Dot */}
            <View style={styles.unreadDot} />
            {/* Mini Lock Badge */}
            <View style={styles.miniLockBadge}>
              <Ionicons name="lock-closed" size={8} color="#FFFFFF" />
            </View>
          </View>

          {/* Middle Content */}
          <View style={styles.content}>
            <View style={styles.titleRow}>
              <Text style={styles.pendingTitleCn} numberOfLines={1}>
                {item.titleCn}
              </Text>
              <Text style={styles.sparkleIcon}>✨</Text>
            </View>
            <Text style={styles.pendingTitleEn} numberOfLines={1}>
              {item.titleEn}
            </Text>

            {/* Sealed Secret Teaser Pill */}
            <View style={styles.sealedTeaserBox}>
              <Ionicons name="eye-off-outline" size={11} color="#E11D48" />
              <Text style={styles.sealedTeaserText} numberOfLines={1}>
                {item.descCn ? `${item.descCn.slice(0, 14)}...` : "寄往未來的秘密信件"}
              </Text>
            </View>

            <Text style={styles.pendingMeta}>
              {item.date} • {item.charCount}
            </Text>
          </View>

          {/* Right Action: Tap to Open Pill */}
          <View style={styles.rightActionCol}>
            <View style={styles.tapToOpenBtn}>
              <Ionicons name="mail-unread" size={14} color="#FFFFFF" />
              <Text style={styles.tapToOpenTextZh}>點擊拆閱</Text>
              <Text style={styles.tapToOpenTextEn}>Tap to Open</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // 2. OPENED LETTER CARD (Clean Archive Theme)
  // ══════════════════════════════════════════════════════════════════
  return (
    <TouchableOpacity
      onPress={() => onPress?.(item)}
      activeOpacity={0.85}
      style={[styles.cardBase, styles.openedCard]}
    >
      <View style={styles.cardInnerRow}>
        {/* Left Icon Box */}
        <View
          style={[
            styles.iconBox,
            styles.openedIconBox,
            { backgroundColor: getBgColor(item.bgColor) },
          ]}
        >
          <Text style={styles.iconEmoji}>{item.icon}</Text>
        </View>

        {/* Middle Content */}
        <View style={styles.content}>
          <Text style={styles.openedTitleCn} numberOfLines={1}>
            {item.titleCn}
          </Text>
          <Text style={styles.openedTitleEn} numberOfLines={1}>
            {item.titleEn}
          </Text>
          <Text style={styles.openedDescCn} numberOfLines={1}>
            {item.descCn}
          </Text>
          <Text style={styles.openedMeta}>
            {item.date} • {item.charCount}
          </Text>
        </View>

        {/* Right Badge & Chevron */}
        <View style={styles.rightGroup}>
          <View style={styles.openedBadge}>
            <Ionicons name="checkmark-circle-outline" size={12} color="#10B981" />
            <View style={styles.badgeTextCol}>
              <Text style={styles.openedTextZh}>已開啟</Text>
              <Text style={styles.openedTextEn}>Opened</Text>
            </View>
          </View>

          <Ionicons
            name="chevron-forward"
            size={16}
            color="#A7F3D0"
            style={{ marginTop: 8 }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardBase: {
    width: "100%",
    borderRadius: 22,
    marginBottom: 12,
    overflow: "hidden",
  },
  cardInnerRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 13,
  },

  // ─── PENDING CARD STYLES ───────────────────────────────────────────
  pendingCard: {
    backgroundColor: "#FFFDF9",
    borderWidth: 1.5,
    borderColor: "#FDA4AF", // Warm rose outline
    shadowColor: "#F43F5E",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.16,
    shadowRadius: 8,
    elevation: 4,
  },
  airmailStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#FFE4E6",
    paddingHorizontal: 12,
    paddingVertical: 3.5,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(244, 63, 94, 0.15)",
  },
  airmailDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  sealedTagText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#E11D48",
    fontFamily: "Sora-Bold",
    letterSpacing: 0.5,
    marginLeft: 2,
  },
  pendingIconBox: {
    borderColor: "#F472B6",
    borderWidth: 1.5,
    shadowColor: "#F43F5E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 2,
  },
  unreadDot: {
    position: "absolute",
    top: 3,
    right: 3,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#F43F5E",
    borderWidth: 1.8,
    borderColor: "#FFFFFF",
  },
  miniLockBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: "#E11D48",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  pendingTitleCn: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#43160E",
    fontFamily: "ZenMaruGothic-Black",
    flexShrink: 1,
  },
  sparkleIcon: {
    fontSize: 12,
  },
  pendingTitleEn: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#BE123C",
    fontFamily: "Sora-Bold",
    marginTop: 0.5,
  },
  sealedTeaserBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFF1F2",
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginTop: 5,
    alignSelf: "flex-start",
    borderWidth: 0.8,
    borderColor: "rgba(244, 63, 94, 0.2)",
  },
  sealedTeaserText: {
    fontSize: 10,
    color: "#E11D48",
    fontFamily: "ZenMaruGothic-Bold",
  },
  pendingMeta: {
    fontSize: 9,
    fontWeight: "600",
    color: "#BE185D",
    marginTop: 5,
    fontFamily: "Sora-Medium",
  },
  rightActionCol: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },
  tapToOpenBtn: {
    backgroundColor: "#F43F5E",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#F43F5E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 3,
  },
  tapToOpenTextZh: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: "ZenMaruGothic-Bold",
    marginTop: 2,
  },
  tapToOpenTextEn: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.9)",
    fontFamily: "Sora-Bold",
  },

  // ─── OPENED CARD STYLES ───────────────────────────────────────────
  openedCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "rgba(0, 0, 0, 0.04)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  openedIconBox: {
    borderColor: "rgba(167, 243, 208, 0.7)",
  },
  openedTitleCn: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#334155",
    fontFamily: "ZenMaruGothic-Bold",
  },
  openedTitleEn: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#059669",
    fontFamily: "Sora-Bold",
    marginTop: 0.5,
  },
  openedDescCn: {
    fontSize: 10,
    color: "#64748B",
    marginTop: 3,
    fontFamily: "ZenMaruGothic-Medium",
  },
  openedMeta: {
    fontSize: 9,
    fontWeight: "500",
    color: "#94A3B8",
    marginTop: 5,
    fontFamily: "Sora-Medium",
  },

  // ─── COMMON STYLES ────────────────────────────────────────────────
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  iconEmoji: {
    fontSize: 26,
  },
  content: {
    flex: 1,
    marginLeft: 11,
    paddingRight: 4,
  },
  rightGroup: {
    alignItems: "flex-end",
    marginLeft: 4,
  },
  openedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.25)",
  },
  badgeTextCol: {
    alignItems: "center",
  },
  openedTextZh: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#10B981",
    lineHeight: 10,
    fontFamily: "ZenMaruGothic-Bold",
  },
  openedTextEn: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#10B981",
    lineHeight: 9,
    fontFamily: "Sora-Bold",
  },
});

export default LetterCard;
