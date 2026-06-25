import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
const EXTERNAL_URLS = {
  inicio: "https://biblioteca-do-estudante.vercel.app/",
  biblioteca: "https://biblioteca-do-estudante.vercel.app/library",
  atividades: "https://biblioteca-do-estudante.vercel.app/activities",
  essay: "https://biblioteca-do-estudante.vercel.app/essay",
  solverequacoes: "https://solver-equacoes.vercel.app/",
  calculadoracarbono: "https://calculadora-carbono-cedup.vercel.app/",
};

export const NavigationHeader = () => {
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width,
  );

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState("calculadoracarbono");

  const menuAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setWindowWidth(window.width);

      if (window.width >= 768) {
        setIsMenuOpen(false);
      }
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    Animated.timing(menuAnimation, {
      toValue: isMenuOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isMenuOpen]);

  const isMobile = windowWidth < 768;

  const navItems = [
    {
      id: "homepage",
      label: "Início",
      url: EXTERNAL_URLS.inicio,
      isInternal: false,
    },
    {
      id: "library",
      label: "Biblioteca",
      url: EXTERNAL_URLS.biblioteca,
      isInternal: false,
    },
    {
      id: "activities",
      label: "Simulados",
      url: EXTERNAL_URLS.atividades,
      isInternal: false,
    },
    {
      id: "essay",
      label: "Redação",
      url: EXTERNAL_URLS.essay,
      isInternal: false,
    },
    {
      id: "solverequacoes",
      label: "SolverEquações",
      url: EXTERNAL_URLS.solverequacoes,
      isInternal: false,
    },
    {
      id: "calculadoracarbono",
      label: "CalculadoraCarbono",
      url: EXTERNAL_URLS.calculadoracarbono,
      isInternal: false,
    },
  ];

  const closeMobileMenu = () => {
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  const handleItemPress = async (item: any) => {
    closeMobileMenu();

    window.location.href = item.url;
  };

  const animatedHeight = menuAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300],
  });

  const animatedOpacity = menuAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View
      style={[
        styles.header,
        !isMobile && {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
      ]}
    >
      <Pressable
        onPress={() =>
          Linking.openURL("https://biblioteca-do-estudante.vercel.app/")
        }
        style={styles.logoContainer}
      >
        <Image
          source={require("../../assets/png/203logo.png")}
          style={styles.logo}
        />
      </Pressable>

      {isMobile && (
        <Pressable
          style={[styles.menuButton, isMenuOpen && styles.menuButtonActive]}
          onPress={() => setIsMenuOpen((prev) => !prev)}
        >
          <View style={styles.line} />
          <View style={[styles.line, isMenuOpen && { opacity: 0 }]} />
          <View style={styles.line} />
        </Pressable>
      )}

      {!isMobile && (
        <View style={styles.desktopMenu}>
          {navItems.map((item) => (
            <NavItem
              key={item.id}
              label={item.label}
              active={activeItem === item.id}
              onPress={() => handleItemPress(item)}
            />
          ))}
        </View>
      )}

      {isMobile && (
        <Animated.View
          style={[
            styles.mobileMenu,
            {
              height: animatedHeight,
              opacity: animatedOpacity,
            },
          ]}
        >
          {navItems.map((item) => (
            <NavItem
              key={item.id}
              label={item.label}
              mobile
              onPress={() => handleItemPress(item)}
            />
          ))}
        </Animated.View>
      )}
    </View>
  );
};

type NavItemProps = {
  label: string;
  onPress: () => void;
  mobile?: boolean;
  active?: boolean;
};

const NavItem = ({ label, onPress, mobile, active }: NavItemProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.navButton,
        mobile && styles.navButtonMobile,
        active && styles.navButtonActive,
        pressed && styles.navButtonPressed,
      ]}
    >
      <Text
        style={[
          styles.navText,
          mobile && styles.navTextMobile,
          active && styles.navTextActive,
        ]}
      >
        {mobile ? label.replace(/([a-záéíóúãõç])([A-Z])/g, "$1\n$2") : label}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#501c2f",
    paddingHorizontal: 24,
    paddingVertical: 12,
    elevation: 6,
    zIndex: 1000,
  },

  logoContainer: {
    alignSelf: "flex-start",
  },

  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },

  desktopMenu: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },

  navButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
  },

  navButtonPressed: {
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  navText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },

  menuButton: {
    position: "absolute",
    right: 16,
    top: 20,
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
  },

  menuButtonActive: {
    backgroundColor: "rgba(255,255,255,0.18)",
  },

  line: {
    width: 20,
    height: 2,
    backgroundColor: "#FFF",
    marginVertical: 2,
  },

  mobileMenu: {
    overflow: "hidden",
    marginTop: 10,
  },

  navButtonMobile: {
    width: "100%",
    marginBottom: 8,
    paddingVertical: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  navTextMobile: {
    textAlign: "center",
    lineHeight: 18,
  },
  navButtonActive: {
    backgroundColor: "rgba(255,255,255,0.16)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },

  navTextActive: {
    fontWeight: "700",
  },
});
