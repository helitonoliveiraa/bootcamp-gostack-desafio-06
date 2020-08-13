import React, {Component} from 'react';
import {Keyboard, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';

import api from '../../services/api';

import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
  DeleteIcon,
  Top,
} from './styles';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newUser: '',
      users: [],
      loading: false,
      hasError: false,
    };
  }

  async componentDidMount() {
    const users = await AsyncStorage.getItem('@repositories');

    console.tron.log(users);

    if (users) {
      this.setState({users: JSON.parse(users)});
    }
  }

  componentDidUpdate(_, prevState) {
    const {users} = this.state;

    if (prevState.users !== users) {
      AsyncStorage.setItem('@repositories', JSON.stringify(users));
    }
  }

  handleAddUser = async () => {
    const {newUser, users} = this.state;
    this.setState({loading: true});

    const userExists = users.find(u => u.login === newUser);

    if (userExists) {
      this.setState({
        hasError: true,
        newUser: '',
      });

      setTimeout(() => {
        this.setState({
          hasError: false,
          loading: false,
        });
      }, 2000);

      return;
    }

    if (newUser !== '') {
      this.setState({hasError: false});
    }

    const response = await api.get(`/users/${newUser}`);

    const data = {
      name: response.data.name,
      login: response.data.login,
      bio: response.data.bio,
      avatar: response.data.avatar_url,
    };

    this.setState({
      users: [...users, data],
      newUser: '',
      loading: false,
    });

    // faz o teclado desaparecer após o submit
    Keyboard.dismiss();
  };

  handleDelete = item => {
    // const {users} = this.state;
    // const afterDel = users.filter(u => u !== item);

    console.tron.log(item);

    // this.setState({
    //   users: afterDel,
    // });
  };

  handleNavigate = user => {
    const {navigation} = this.props;

    navigation.navigate('User', {user});
  };

  render() {
    const {newUser, users, loading, hasError} = this.state;

    return (
      <Container>
        <Form>
          <Input
            hasError={hasError}
            autoCorrect={false}
            autoCapitalize="none"
            placeholder={hasError ? 'Usuário já existe' : 'Adicionar usuário'}
            value={newUser}
            onChangeText={text => this.setState({newUser: text})}
            returnKeyType="send"
            onSubmitEditing={this.handleAddUser}
          />

          <SubmitButton onPress={this.handleAddUser} loading={loading}>
            {loading ? (
              <ActivityIndicator size={20} color="#fff" />
            ) : (
              <Icon name="add" size={20} color="#fff" />
            )}
          </SubmitButton>
        </Form>

        <List
          data={users}
          keyExtractor={user => user.login}
          renderItem={({item}) => (
            <User>
              <Top>
                <Icon name="delete" size={30} color="rgba(32, 201, 151, 0.0)" />
                <Avatar source={{uri: item.avatar}} />
                <DeleteIcon onPres={() => this.handleDelete(item)}>
                  <Icon name="delete" size={20} color="#ff3333" />
                </DeleteIcon>
              </Top>
              <Name>{item.name}</Name>
              <Bio>{item.bio}</Bio>

              <ProfileButton onPress={() => this.handleNavigate(item)}>
                <ProfileButtonText>Ver perfil</ProfileButtonText>
              </ProfileButton>
            </User>
          )}
        />
      </Container>
    );
  }
}

Main.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default Main;
