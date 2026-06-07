import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Modal,
  TextInput,
  Platform,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Animated,
  PanResponder,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// ─── Three.js Globe HTML avec couleurs améliorées ─────────────────────────────
const GLOBE_HTML = `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<style>
  *{margin:0;padding:0;box-sizing:border-box;}
  html,body{width:100%;height:100%;background:transparent;overflow:hidden;}
  canvas{display:block;}
</style>
</head>
<body>
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
const W=window.innerWidth,H=window.innerHeight;
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
renderer.setSize(W,H);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
renderer.setClearColor(0x000000,0);
document.body.appendChild(renderer.domElement);

const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(42,W/H,0.1,1000);
camera.position.z=2.5;

// ── Canvas texture avec couleurs plus vives ──
const TC=document.createElement('canvas');
TC.width=2048;TC.height=1024;
const ctx=TC.getContext('2d');

// Ocean gradient plus vibrant
const og=ctx.createLinearGradient(0,0,0,1024);
og.addColorStop(0,'#6BB5D9');
og.addColorStop(0.5,'#8ECAE6');
og.addColorStop(1,'#219EBC');
ctx.fillStyle=og;ctx.fillRect(0,0,2048,1024);

// Grid lines plus subtiles
ctx.strokeStyle='rgba(255,255,255,0.15)';ctx.lineWidth=1;
for(let lat=-80;lat<=80;lat+=15){const y=(90-lat)/180*1024;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(2048,y);ctx.stroke();}
for(let lon=-180;lon<180;lon+=15){const x=(lon+180)/360*2048;ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,1024);ctx.stroke();}

function xy(lon,lat){return[(lon+180)/360*2048,(90-lat)/180*1024];}

function land(pts,color){
  ctx.fillStyle=color;
  ctx.beginPath();
  const[sx,sy]=xy(pts[0][0],pts[0][1]);ctx.moveTo(sx,sy);
  for(let i=1;i<pts.length;i++){const[x,y]=xy(pts[i][0],pts[i][1]);ctx.lineTo(x,y);}
  ctx.closePath();ctx.fill();
}

// Couleurs plus riches pour les continents
const LAND_PRIMARY='#52B788';
const LAND_SECONDARY='#40916C';
const LAND_ACCENT='#2D6A4F';
const ICE='#E9F5F0';
const SAND='#F4A261';

// North America
land([[-168,72],[-140,70],[-120,72],[-95,72],[-75,68],[-65,63],[-60,47],[-67,44],[-70,42],[-75,35],[-80,25],[-85,22],[-90,15],[-85,10],[-78,8],[-76,9],[-79,22],[-84,30],[-90,29],[-97,26],[-105,20],[-110,23],[-117,32],[-120,38],[-124,48],[-130,56],[-140,60],[-152,60],[-160,60],[-165,68],[-168,72]],LAND_PRIMARY);
// Greenland
land([[-68,76],[-50,83],[-20,83],[-15,77],[-22,70],[-42,65],[-55,65],[-65,70],[-68,76]],ICE);
// South America
land([[-80,12],[-75,10],[-68,12],[-62,10],[-52,4],[-38,-4],[-35,-8],[-35,-20],[-38,-30],[-45,-38],[-55,-55],[-68,-55],[-72,-45],[-72,-35],[-68,-25],[-62,-15],[-60,-5],[-65,0],[-72,2],[-78,5],[-80,12]],LAND_SECONDARY);
// Europe
land([[-9,38],[-5,36],[2,36],[10,38],[16,40],[20,38],[28,38],[32,36],[35,38],[28,42],[26,48],[20,55],[18,58],[14,56],[10,56],[5,58],[0,58],[-5,48],[-9,44],[-9,38]],LAND_PRIMARY);
// Scandinavia
land([[5,58],[8,58],[14,56],[18,58],[22,62],[28,70],[28,72],[22,70],[16,68],[14,64],[10,60],[5,58]],LAND_PRIMARY);
// UK
land([[-6,50],[-2,50],[2,51],[2,54],[-2,56],[-6,58],[-6,54],[-6,50]],LAND_PRIMARY);
// Africa
land([[-5,36],[2,36],[12,32],[22,32],[36,22],[42,12],[44,8],[42,4],[38,-4],[34,-16],[30,-30],[20,-36],[14,-36],[10,-30],[8,-22],[2,-4],[0,4],[-2,6],[-8,4],[-14,10],[-16,14],[-14,20],[-8,30],[-5,36]],LAND_ACCENT);
// Madagascar
land([[44,-12],[50,-14],[50,-24],[44,-26],[44,-18],[44,-12]],LAND_ACCENT);
// Asia
land([[28,42],[32,38],[38,36],[45,38],[55,40],[60,38],[65,28],[70,22],[80,18],[85,12],[95,5],[100,2],[104,2],[108,10],[115,20],[118,24],[120,28],[120,38],[125,32],[130,32],[130,42],[128,48],[126,52],[122,52],[115,50],[105,52],[95,56],[85,58],[78,56],[68,58],[58,56],[48,52],[40,48],[36,46],[32,46],[28,42]],LAND_PRIMARY);
// Indian subcontinent
land([[62,24],[68,24],[72,22],[76,8],[80,8],[82,12],[86,22],[90,22],[92,24],[90,28],[85,28],[80,30],[74,32],[68,28],[62,24]],SAND);
// Indochina
land([[98,20],[102,20],[106,10],[104,2],[100,2],[96,5],[95,16],[98,20]],LAND_SECONDARY);
// Japan
land([[130,31],[132,34],[134,35],[136,36],[138,40],[141,42],[141,44],[138,44],[136,40],[134,36],[130,34],[130,31]],LAND_PRIMARY);
// Australia
land([[114,-22],[118,-18],[122,-17],[128,-14],[132,-12],[136,-12],[140,-16],[145,-18],[150,-24],[152,-28],[150,-38],[146,-38],[142,-38],[136,-36],[130,-32],[120,-34],[116,-30],[114,-26],[114,-22]],SAND);
// New Zealand
land([[172,-34],[174,-38],[172,-44],[170,-46],[168,-44],[170,-40],[172,-34]],LAND_PRIMARY);
// Ice caps
land([[-180,68],[-100,68],[-60,62],[-20,62],[0,65],[40,68],[80,72],[120,72],[160,70],[180,68],[180,90],[-180,90],[-180,68]],ICE);
land([[-180,-65],[-100,-65],[-60,-68],[-20,-70],[40,-68],[120,-68],[160,-65],[180,-65],[180,-90],[-180,-90],[-180,-65]],ICE);

// City dots avec couleurs plus vives
const CITIES=[[2.35,48.85],[139.69,35.68],[-74,40.7],[151.2,-33.86],[28.97,41.01],[-43.17,-22.9],[72.88,19.07],[116.4,39.9],[-0.12,51.5],[18.42,-33.92],[31.24,30.06],[37.62,55.75],[103.8,1.35],[55.3,25.2]];
CITIES.forEach(([lon,lat])=>{
  const[x,y]=xy(lon,lat);
  ctx.beginPath();ctx.arc(x,y,7,0,Math.PI*2);
  ctx.fillStyle='rgba(247,37,133,0.9)';ctx.fill();
  ctx.beginPath();ctx.arc(x,y,13,0,Math.PI*2);
  ctx.fillStyle='rgba(247,37,133,0.2)';ctx.fill();
  ctx.beginPath();ctx.arc(x,y,19,0,Math.PI*2);
  ctx.fillStyle='rgba(247,37,133,0.08)';ctx.fill();
});

// Connection arcs avec couleurs dégradées
CITIES.forEach((city, idx) => {
  if(idx < CITIES.length - 1) {
    const[x1,y1]=xy(city[0],city[1]);
    const[x2,y2]=xy(CITIES[idx+1][0],CITIES[idx+1][1]);
    const gradient=ctx.createLinearGradient(x1,y1,x2,y2);
    gradient.addColorStop(0,'rgba(247,37,133,0.4)');
    gradient.addColorStop(1,'rgba(114,9,183,0.4)');
    ctx.strokeStyle=gradient;
    ctx.lineWidth=2;
    ctx.beginPath();ctx.moveTo(x1,y1);
    ctx.quadraticCurveTo((x1+x2)/2,(y1+y2)/2-100,x2,y2);
    ctx.stroke();
  }
});

const texture=new THREE.CanvasTexture(TC);

// Globe avec matériau plus brillant
const globe=new THREE.Mesh(
  new THREE.SphereGeometry(1,96,96),
  new THREE.MeshStandardMaterial({map:texture,roughness:0.3,metalness:0.1,emissive:new THREE.Color(0x114455),emissiveIntensity:0.1})
);
scene.add(globe);

// Atmosphere glow amélioré
const atmosphereMat=new THREE.MeshPhongMaterial({color:0x4CC9F0,transparent:true,opacity:0.12,side:THREE.BackSide});
scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.08,64,64),atmosphereMat));

// Étoiles plus brillantes
const sv=[];
for(let i=0;i<2000;i++){
  const t=Math.random()*Math.PI*2,p=Math.acos(2*Math.random()-1),r=8+Math.random()*4;
  sv.push(r*Math.sin(p)*Math.cos(t),r*Math.sin(p)*Math.sin(t),r*Math.cos(p));
}
const sg=new THREE.BufferGeometry();
sg.setAttribute('position',new THREE.Float32BufferAttribute(sv,3));
scene.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0xFFFFFF,size:0.022,transparent:true,opacity:0.6})));

// Particules autour du globe
const particleCount=800;
const particles=[];
for(let i=0;i<particleCount;i++){
  const theta=Math.random()*Math.PI*2;
  const phi=Math.acos(2*Math.random()-1);
  const r=1.15;
  particles.push(r*Math.sin(phi)*Math.cos(theta),r*Math.sin(phi)*Math.sin(theta),r*Math.cos(phi));
}
const pg=new THREE.BufferGeometry();
pg.setAttribute('position',new THREE.Float32BufferAttribute(particles,3));
scene.add(new THREE.Points(pg,new THREE.PointsMaterial({color:0x4CC9F0,size:0.008,transparent:true,opacity:0.4})));

// Lights améliorés
scene.add(new THREE.AmbientLight(0x223344,0.8));
const sun=new THREE.DirectionalLight(0xFFE6CC,1.4);sun.position.set(5,4,3);scene.add(sun);
const fill=new THREE.DirectionalLight(0x88AACC,0.5);fill.position.set(-3,-2,-4);scene.add(fill);
const backLight=new THREE.PointLight(0x4CC9F0,0.3);backLight.position.set(-2,1,-3);scene.add(backLight);

// Touch drag
let drag=false,px=0,py=0,vx=0,vy=0,auto=true;
renderer.domElement.addEventListener('touchstart',e=>{drag=true;auto=false;px=e.touches[0].clientX;py=e.touches[0].clientY;vx=0;vy=0;},{passive:true});
renderer.domElement.addEventListener('touchmove',e=>{
  if(!drag)return;
  const dx=e.touches[0].clientX-px,dy=e.touches[0].clientY-py;
  vx=dx*0.008;vy=dy*0.008;
  globe.rotation.y+=vx;
  globe.rotation.x=Math.max(-0.8,Math.min(0.8,globe.rotation.x+vy));
  px=e.touches[0].clientX;py=e.touches[0].clientY;
},{passive:true});
renderer.domElement.addEventListener('touchend',()=>{drag=false;});

function animate(){
  requestAnimationFrame(animate);
  if(!drag){
    if(auto){globe.rotation.y+=0.002;}
    else{vx*=0.94;vy*=0.94;globe.rotation.y+=vx;globe.rotation.x+=vy;if(Math.abs(vx)<0.0002&&Math.abs(vy)<0.0002)auto=true;}
  }
  renderer.render(scene,camera);
}
animate();
</script>
</body>
</html>`;

// ─── Auth Modal améliorée avec option de connexion directement ─────────────────
interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  defaultStep?: 'choose' | 'email';
}

const AuthModal: React.FC<AuthModalProps> = ({ visible, onClose, defaultStep = 'choose' }) => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'choose' | 'email'>(defaultStep);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setStep(defaultStep);
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      slideAnim.setValue(0);
      setEmail('');
    }
  }, [visible, defaultStep]);

  const handleClose = () => { 
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setStep('choose');
      setEmail('');
      onClose();
    });
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={StyleSheet.absoluteFill} onPress={handleClose} activeOpacity={1} />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Animated.View 
            style={[
              styles.modalSheet,
              {
                transform: [{
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [600, 0],
                  })
                }]
              }
            ]}
          >
            <LinearGradient
              colors={['#FFFFFF', '#F8F9FF']}
              style={styles.modalGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.modalHandle} />

              <Image source={require('../assets/logo.png')} style={styles.modalLogo} resizeMode="contain" />
              <Text style={styles.modalTitle}>Bienvenue</Text>
              <Text style={styles.modalSubtitle}>
                Connectez-vous pour découvrir des expériences locales authentiques à travers le monde
              </Text>

              {step === 'choose' ? (
                <>
                  <TouchableOpacity style={styles.socialGoogle} activeOpacity={0.8}>
                    <LinearGradient
                      colors={['#FFFFFF', '#FFFFFF']}
                      style={styles.socialGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <FontAwesome5 name="google" size={18} color="#4285F4" />
                      <Text style={styles.socialGoogleText}>Continuer avec Google</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.socialApple} activeOpacity={0.8}>
                    <LinearGradient
                      colors={['#1A1A2E', '#2D2D44']}
                      style={styles.socialGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <FontAwesome5 name="apple" size={20} color="#FFFFFF" />
                      <Text style={styles.socialAppleText}>Continuer avec Apple</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.socialEmail} onPress={() => setStep('email')} activeOpacity={0.8}>
                    <LinearGradient
                      colors={['#EEF3FF', '#E8EFFF']}
                      style={styles.socialGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <FontAwesome5 name="envelope" size={16} color="#1C6BF4" />
                      <Text style={styles.socialEmailText}>Continuer avec l'email</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <View style={styles.dividerRow}>
                    <View style={styles.divLine} />
                    <Text style={styles.divText}>Vous êtes</Text>
                    <View style={styles.divLine} />
                  </View>

                  <View style={styles.roleRow}>
                    <TouchableOpacity style={styles.roleBtn} activeOpacity={0.8}>
                      <FontAwesome5 name="globe-americas" size={16} color="#1C6BF4" />
                      <Text style={styles.roleBtnText}>Voyageur</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.roleBtn, styles.roleBtnActive]} activeOpacity={0.8}>
                      <LinearGradient
                        colors={['#1C6BF4', '#1557CC']}
                        style={StyleSheet.absoluteFill}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      />
                      <FontAwesome5 name="store" size={16} color="#FFFFFF" />
                      <Text style={[styles.roleBtnText, styles.roleBtnTextActive]}>Prestataire</Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.legalText}>
                    En continuant, vous acceptez nos{' '}
                    <Text style={styles.legalLink}>CGU</Text>{' '}et notre{' '}
                    <Text style={styles.legalLink}>Politique de confidentialité</Text>
                  </Text>
                </>
              ) : (
                <>
                  <Text style={styles.emailInputLabel}>Adresse email</Text>
                  <View style={styles.emailInputBox}>
                    <FontAwesome5 name="envelope" size={14} color="#B0B0C8" />
                    <TextInput
                      style={styles.emailInput}
                      placeholder="votre@email.com"
                      placeholderTextColor="#C0C0D0"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoFocus
                      value={email}
                      onChangeText={setEmail}
                    />
                  </View>
                  <Text style={styles.emailHint}>
                    <FontAwesome5 name="info-circle" size={11} color="#B0B0C8" />
                    {'  '}Un lien de connexion vous sera envoyé — sans mot de passe.
                  </Text>

                  <TouchableOpacity style={styles.submitBtn} activeOpacity={0.8}>
                    <LinearGradient
                      colors={['#1C6BF4', '#1557CC', '#0E3D8C']}
                      style={styles.submitGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Text style={styles.submitLabel}>Envoyer le lien</Text>
                      <FontAwesome5 name="arrow-right" size={14} color="#FFFFFF" />
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => setStep('choose')} style={styles.backBtn} activeOpacity={0.7}>
                    <FontAwesome5 name="arrow-left" size={12} color="#B0B0C8" />
                    <Text style={styles.backText}>Retour</Text>
                  </TouchableOpacity>
                </>
              )}
            </LinearGradient>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

// ─── HomeScreen améliorée sans bouton connexion en haut ─────────────────────
const HomeScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const FILTERS = [
    { key: 'culture', label: 'Culture', icon: 'landmark', color: '#F72585' },
    { key: 'food', label: 'Gastronomie', icon: 'utensils', color: '#F8961E' },
    { key: 'nature', label: 'Nature', icon: 'leaf', color: '#4CAF50' },
    { key: 'sport', label: 'Sport', icon: 'running', color: '#00B4D8' },
    { key: 'photo', label: 'Photographie', icon: 'camera', color: '#9C27B0' },
    { key: 'histoire', label: 'Histoire', icon: 'scroll', color: '#FF6B6B' },
  ];

  // Fonction pour ouvrir le modal directement avec l'option de connexion
  const openAuthModal = (userType?: 'traveler' | 'provider') => {
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Background décoratif */}
      <View style={styles.bgDecoration}>
        <LinearGradient
          colors={['#F8F9FF', '#FFFFFF', '#F0F4FF']}
          style={StyleSheet.absoluteFill}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </View>

      {/* ── Header sans bouton connexion ── */}
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <Image source={require('../assets/logo.png')} style={styles.headerLogo} resizeMode="contain" />
        {/* Bouton connexion supprimé */}
      </Animated.View>

      {/* ── Globe ── */}
      <View style={styles.globeContainer}>
        <WebView
          source={{ html: GLOBE_HTML }}
          style={styles.globeWebview}
          scrollEnabled={false}
          javaScriptEnabled={true}
          originWhitelist={['*']}
          backgroundColor="transparent"
          setBuiltInZoomControls={false}
          setDisplayZoomControls={false}
        />
        <LinearGradient
          colors={['transparent', '#FFFFFF']}
          style={styles.globeFade}
          pointerEvents="none"
        />
      </View>

      {/* ── Bottom panel ── */}
      <Animated.View 
        style={[
          styles.bottomPanel,
          {
            opacity: fadeAnim,
            transform: [{ translateY: translateYAnim }, { scale: scaleAnim }]
          }
        ]}
      >
        {/* Pill avec animation */}
        <Animated.View style={[styles.pillRow, { opacity: fadeAnim }]}>
          <LinearGradient
            colors={['#EEF3FF', '#E8EFFF']}
            style={styles.pill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <FontAwesome5 name="map-marked-alt" size={12} color="#1C6BF4" />
            <Text style={styles.pillText}>Marketplace de voyage local</Text>
          </LinearGradient>
        </Animated.View>

        {/* Headline avec gradient */}
        <Text style={styles.headline}>
          Voyagez avec des{'\n'}
          <Text style={styles.headlineAccent}>experts locaux</Text>
        </Text>

        <Text style={styles.description}>
          Des prestataires locaux vous font découvrir leur pays, leur culture et leurs lieux secrets — des expériences uniques, authentiques et sur-mesure.
        </Text>

        {/* Services avec couleurs dynamiques */}
        <Text style={styles.sectionLabel}>
          <FontAwesome5 name="th-large" size={11} color="#9A9AB0" />
          {'  '}Services disponibles
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersRow}>
          {FILTERS.map((f, index) => (
            <Animated.View
              key={f.key}
              style={{
                transform: [{
                  scale: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1],
                  })
                }]
              }}
            >
              <TouchableOpacity 
                style={[
                  styles.filterChip,
                  selectedFilter === f.key && styles.filterChipActive,
                  { borderColor: selectedFilter === f.key ? f.color : '#E0E8FF' }
                ]} 
                onPress={() => setSelectedFilter(f.key === selectedFilter ? null : f.key)}
                activeOpacity={0.7}
              >
                <FontAwesome5 name={f.icon} size={14} color={selectedFilter === f.key ? '#FFFFFF' : f.color} />
                <Text style={[styles.filterLabel, selectedFilter === f.key && styles.filterLabelActive]}>{f.label}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>

        {/* CTA row avec gradients - ces boutons ouvrent directement le modal de connexion */}
        <View style={styles.ctaRow}>
          <TouchableOpacity style={styles.ctaBtnPrimary} onPress={() => openAuthModal('traveler')} activeOpacity={0.8}>
            <LinearGradient
              colors={['#1C6BF4', '#1557CC', '#0E3D8C']}
              style={styles.ctaGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <FontAwesome5 name="globe-americas" size={15} color="#FFFFFF" />
              <Text style={styles.ctaBtnPrimaryText}>Je suis voyageur</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctaBtnSecondary} onPress={() => openAuthModal('provider')} activeOpacity={0.8}>
            <LinearGradient
              colors={['#EEF3FF', '#E8EFFF']}
              style={styles.ctaSecondaryGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <FontAwesome5 name="store" size={15} color="#1C6BF4" />
              <Text style={styles.ctaBtnSecondaryText}>Prestataire</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <AuthModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
};

// ─── Styles améliorés ─────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  bgDecoration: { position: 'absolute', width: width, height: height },

  // Header - sans bouton connexion
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 0, right: 0,
    zIndex: 20,
    flexDirection: 'row',
    justifyContent: 'center', // Centré car pas de bouton à droite
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerLogo: { width: 120, height: 36 },

  // Globe
  globeContainer: {
    width: width,
    height: height * 0.52,
    overflow: 'hidden',
  },
  globeWebview: { flex: 1, backgroundColor: 'transparent' },
  globeFade: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    height: 100,
  },

  // Bottom panel
  bottomPanel: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 22,
    paddingTop: 6,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  pillRow: { flexDirection: 'row', marginBottom: 12 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  pillText: { color: '#1C6BF4', fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },

  headline: {
    fontSize: 30,
    fontWeight: '800',
    color: '#0A0A1A',
    letterSpacing: -0.8,
    lineHeight: 36,
    marginBottom: 10,
  },
  headlineAccent: { 
    color: '#1C6BF4',
    position: 'relative',
  },

  description: {
    fontSize: 14,
    color: '#8A8AA8',
    lineHeight: 21,
    marginBottom: 20,
  },

  sectionLabel: { fontSize: 11, color: '#9A9AB0', fontWeight: '600', letterSpacing: 0.5, marginBottom: 12 },

  filtersRow: { gap: 10, paddingRight: 4, marginBottom: 22 },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F4F7FF',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1.5,
  },
  filterChipActive: {
    backgroundColor: '#1C6BF4',
  },
  filterLabel: { fontSize: 13, fontWeight: '600', color: '#1C6BF4' },
  filterLabelActive: { color: '#FFFFFF' },

  // CTA
  ctaRow: { flexDirection: 'row', gap: 12 },
  ctaBtnPrimary: {
    flex: 2,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#1C6BF4',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
  },
  ctaBtnPrimaryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  ctaBtnSecondary: {
    flex: 1,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#D0DEFF',
  },
  ctaSecondaryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  ctaBtnSecondaryText: { color: '#1C6BF4', fontSize: 15, fontWeight: '700' },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10,10,30,0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  },
  modalGradient: {
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 44 : 30,
    paddingTop: 14,
  },
  modalHandle: {
    width: 40, height: 4,
    backgroundColor: '#D0D0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalLogo: { width: 140, height: 42, alignSelf: 'center', marginBottom: 16 },
  modalTitle: {
    fontSize: 26, fontWeight: '800', color: '#0A0A1A',
    textAlign: 'center', marginBottom: 6, letterSpacing: -0.5,
  },
  modalSubtitle: {
    fontSize: 14, color: '#8A8AA8', textAlign: 'center',
    lineHeight: 20, marginBottom: 26, paddingHorizontal: 12,
  },

  // Social buttons
  socialGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 12,
  },
  socialGoogle: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E8E8F0',
  },
  socialGoogleText: {
    fontSize: 15, fontWeight: '600', color: '#1A1A2E',
  },
  socialApple: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 10,
  },
  socialAppleText: {
    fontSize: 15, fontWeight: '600', color: '#FFFFFF',
  },
  socialEmail: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 20,
  },
  socialEmailText: {
    fontSize: 15, fontWeight: '600', color: '#1C6BF4',
  },

  // Role selector
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  divLine: { flex: 1, height: 1, backgroundColor: '#E8E8F0' },
  divText: { fontSize: 11, color: '#B0B0C8', fontWeight: '600', letterSpacing: 0.5 },
  roleRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  roleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 13,
    borderWidth: 1.5,
    borderColor: '#E0E4F0',
    backgroundColor: '#F7F9FF',
    overflow: 'hidden',
  },
  roleBtnActive: { backgroundColor: '#1C6BF4', borderColor: '#1C6BF4' },
  roleBtnText: { fontSize: 14, fontWeight: '700', color: '#1C6BF4' },
  roleBtnTextActive: { color: '#FFFFFF' },

  legalText: { fontSize: 11, color: '#C0C0D0', textAlign: 'center', lineHeight: 16 },
  legalLink: { color: '#9A9AB0', textDecorationLine: 'underline' },

  // Email step
  emailInputLabel: {
    fontSize: 11, fontWeight: '700', color: '#9A9AB0',
    letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8,
  },
  emailInputBox: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#F7F7FB', borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14,
    borderWidth: 1, borderColor: '#E8E8F0', marginBottom: 10,
  },
  emailInput: { flex: 1, fontSize: 15, color: '#0A0A1A' },
  emailHint: { fontSize: 12, color: '#B0B0C8', lineHeight: 18, marginBottom: 18 },

  submitBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#1C6BF4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
  },
  submitLabel: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  backBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 10 },
  backText: { fontSize: 13, color: '#9A9AB0' },
});

export default HomeScreen;