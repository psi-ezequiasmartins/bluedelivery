/**
 * src/components/SideBar/index.js
 * Blue Delivery - UserApp Sidebar com sistema i18n
 */

import { useContext } from 'react';
import { View, Text, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { FontAwesome5, MaterialCommunityIcons, Fontisto, AntDesign, Entypo } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import LanguageSelector from '../LanguageSelector';

import logotipo from '../../../assets/logo.png';

export default function SideBar(props) {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { user, signOut } = useContext(AuthContext);

  function GoToLink(link) {
    return (
      navigation.navigate(link)
    )
  }

  return (
    <DrawerContentScrollView {...props}>

      <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 15, marginBottom: 15 }}>
        <Image source={logotipo} style={{ width: 120, height: 120 }} resizeMode="contain" />
        <Text style={{ color: '#5D5D5D', fontSize: 18, marginTop: 25 }}>{t('user.welcome')}</Text>
        <Text style={{ color: '#0033CC', fontSize: 17, fontWeight: 'bold' }}>{user?.NOME} {user?.SOBRENOME}</Text>
        <Text style={{ color: '#000000', fontSize: 17 }}>{t('user.userId')} {user?.USER_ID}</Text>
      </View>

      {/* Seletor de idiomas */}
      <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
        <LanguageSelector />
      </View>

      <DrawerItem
        label={t('navigation.categories').toUpperCase()}
        onPress={() => GoToLink("HomeDrawer")}
        activeTintColor='#FFF'
        activeBackgroundColor='#0033CC'
        inactiveTintColor='#000'
        inactiveBackgroundColor='transparent'
        borderRadius={10}
        marginTop={5}
        icon={({ focused, size }) => (
          <Entypo name='shop' size={size} color={(focused !== true) ? '#0033CC' : '#FFF'} />
        )}
      />

      <DrawerItem
        label={t('navigation.orders').toUpperCase()}
        onPress={() => GoToLink("OrdersTab")}
        activeTintColor='#FFF'
        activeBackgroundColor='#0033CC'
        inactiveTintColor='#000'
        inactiveBackgroundColor='transparent'
        borderRadius={10}
        marginTop={5}
        icon={({ focused, size }) => (
          <Fontisto name='shopping-bag-1' size={size} color={(focused !== true) ? '#0033CC' : '#FFF'} />
        )}
      />

      <DrawerItem
        label={t('user.myData').toUpperCase()}
        onPress={() => GoToLink("ProfileTab")}
        activeTintColor='#FFF'
        activeBackgroundColor='#0033CC'
        inactiveTintColor='#000'
        inactiveBackgroundColor='transparent'
        borderRadius={10}
        marginTop={5}
        icon={({ focused, size }) => (
          <FontAwesome5 name='user-cog' size={size} color={(focused !== true) ? '#0033CC' : '#FFF'} />
        )}
      />

      <DrawerItem
        label={t('navigation.logout').toUpperCase()}
        onPress={signOut}
        activeTintColor='#FFF'
        activeBackgroundColor='#FF0000'
        inactiveTintColor='#FF0000'
        inactiveBackgroundColor='transparent'
        borderRadius={10}
        marginTop={5}
        icon={({ focused, size }) => (
          <FontAwesome5 name="door-open" size={size} color={(focused !== true) ? '#FF0000' : '#FFF'} />
        )}
      />

      <DrawerItem
        label={t('navigation.closeMenu').toUpperCase()}
        onPress={() => props.navigation.closeDrawer()}
        activeTintColor='#7F7B7B'
        inactiveTintColor='#7F7B7B'
        icon={({ focused, size }) => (
          <MaterialCommunityIcons name="close-box-multiple-outline" size={size} color={(focused !== true) ? '#7F7B7B' : '#000'} />
        )}
      />

      <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 10 }}>
        <Text style={{ color: '#0033CC', fontSize: 18, fontWeight: 'bold' }}>Blue Delivery</Text>
        <Text style={{ color: '#000', fontSize: 16 }}><AntDesign name="copyright" color='#000' size={12} /> {t('footer.copyright')}</Text>
        <Text style={{ color: '#000', fontSize: 14 }}>{t('footer.rightsReserved')}</Text>
      </View>

    </DrawerContentScrollView>
  );
}

/**
 * Blue Delivery - Tabela de cores atualizadas:
 * Azul principal: #0033CC
 * Amarelo: #FFB901 
 * Verde: #4DCE4D
 * Vermelho: #FF0000
 * Cinzas: #5D5D5D #7F7B7B
 * Preto: #000000
 * Branco: #FFFFFF
 * 
 * Cores Blue Delivery 2025:
 * Primary: #0033CC (Azul)
 * Secondary: #FFB901 (Amarelo) 
 * Success: #4DCE4D (Verde)
 * Danger: #FF0000 (Vermelho)
 */
