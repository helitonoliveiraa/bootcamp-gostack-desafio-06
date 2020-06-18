import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {ActivityIndicator} from 'react-native';

import api from '../../services/api';
import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  LoadingContainer,
} from './styles';

export default class User extends Component {
  static navigationOptions = {
    title: 'helo world',
  };

  static propTypes = {
    route: PropTypes.shape().isRequired,
  };

  constructor() {
    super();
    this.state = {
      stars: [],
      laoding: false,
    };
  }

  async componentDidMount() {
    const {route} = this.props;
    const {user} = route.params;

    this.setState({laoding: true});

    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({
      stars: response.data,
      laoding: false,
    });
  }

  render() {
    const {route} = this.props;
    const {stars, laoding} = this.state;

    const {user} = route.params;

    return (
      <Container>
        <Header>
          <Avatar source={{uri: user.avatar}} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        {laoding ? (
          <LoadingContainer>
            <ActivityIndicator size="small" color="#7159c1" />
          </LoadingContainer>
        ) : (
          <Stars
            data={stars}
            keyExtractor={star => String(star.id)}
            renderItem={({item}) => (
              <Starred>
                <OwnerAvatar source={{uri: item.owner.avatar_url}} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
      </Container>
    );
  }
}
