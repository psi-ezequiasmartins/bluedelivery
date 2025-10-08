import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { FontAwesome5, Entypo, Fontisto } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

import Home from '../pages/Grupos';
import Deliveries from '../pages/Delivery';
import DeliveryInfo from '../pages/Delivery/DeliveryInfo';
import Cesta from '../pages/Cesta';
import Pedidos from '../pages/Pedidos';
import Perfil from '../pages/User';

import SideBar from '../components/SideBar';
import OrderDetailsNavigator from '../pages/Pedidos/OrderDetailsNavigator';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const OrdersStack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function AppRoutes() {
  const { t } = useTranslation();

  function getHeaderTitle(route) {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'HomeTab';
    switch (routeName) {
      case 'HomeTab': return t('headers.delivery');
      case 'Deliveries': return t('headers.deliveriesList');
      case 'DeliveryDetails': return t('headers.deliveryInfo');
      case 'OrdersTab': return t('headers.myOrders');
      case 'OrderDetails': return t('headers.orderDetails');
      case 'ProfileTab': return t('headers.userData');
      case 'HomeStack': return t('headers.delivery');
      default: return t('headers.delivery');
    }
  };

  function HomeTabNavigator() {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: { height: 70, backgroundColor: '#FFF' },
          tabBarActiveTintColor: '#0033CC',
          tabBarInactiveTintColor: '#5D5D5D',
          tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
          headerShown: false,
        }}
      >
        <Tab.Screen
          name='HomeTab'
          component={HomeStackNavigator}
          options={({ route }) => ({
            tabBarLabel: t('tabs.deliveries'),
            tabBarIcon: ({ focused }) => (
              <Entypo name='shop' color={(focused !== true) ? '#5D5D5D' : '#0033CC'} size={35} />
            ),
          })}
        />
        <Tab.Screen
          name='OrdersTab'
          component={OrderStackNavigator}
          options={({ route }) => ({
            tabBarLabel: t('tabs.myOrders'),
            tabBarIcon: ({ focused }) => (
              <Fontisto name='shopping-bag-1' color={(focused !== true) ? '#5D5D5D' : '#0033CC'} size={35} />
            ),
          })}
        />
        <Tab.Screen
          name='ProfileTab'
          component={Perfil}
          options={({ route }) => ({
            tabBarLabel: t('tabs.profile'),
            tabBarIcon: ({ focused }) => (
              <FontAwesome5 name='user-cog' color={(focused !== true) ? '#5D5D5D' : '#0033CC'} size={35} />
            ),
          })}
        />
      </Tab.Navigator>
    )
  }

  function HomeStackNavigator() {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          headerTintColor: '#FFF',
          headerStyle: { backgroundColor: '#0033CC', borderBottomWidth: 0 },
        }}
      >
        <Stack.Screen name="HomeStack" component={Home} />
        <Stack.Screen name="Deliveries" component={Deliveries} />
        <Stack.Screen name="DeliveryInfo" component={DeliveryInfo} />
        <Stack.Screen name="Cesta" component={Cesta} />
      </Stack.Navigator>
    );
  }

  function OrderStackNavigator() {
    return (
      <OrdersStack.Navigator
        screenOptions={{
          headerShown: false,
          headerTintColor: '#FFF',
          headerStyle: { backgroundColor: '#0033CC', borderBottomWidth: 0 },
        }}
      >
        <OrdersStack.Screen name="OrdersStack" component={Pedidos} />
        <OrdersStack.Screen
          name="OrderDetailsNavigator"
          component={OrderDetailsNavigator}
          options={{
            title: t('headers.orderDetails'),
            headerTitleAlign: 'center',
          }}
        />
      </OrdersStack.Navigator>
    );
  }

  return (
    <Drawer.Navigator
      drawerContent={(props) => <SideBar {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#FFF',
          width: '70%',
          marginTop: 5,
          marginBotton: 5,
          borderTopRightRadius: 25,
          borderBottomRightRadius: 25,
        },
        drawerLabelStyle: { fontWeight: 'bold' },
        drawerItemStyle: {
          activeTintColor: '#FCC000',
          activeBackgroundColor: '#FF0000',
          inactiveTintColor: '#5D5D5D',
          inactiveBackgroundColor: '#000',
          marginVertical: 5,
        },
      }}
    >
      <Drawer.Screen
        name="HomeDrawer"
        component={HomeTabNavigator}
        options={({ route }) => ({
          headerShown: true,
          headerTitle: getHeaderTitle(route),
          headerTintColor: '#FFF',
          headerStyle: { backgroundColor: '#0033CC', borderBottomWidth: 0 },
        })}
      />
    </Drawer.Navigator>
  );
}
