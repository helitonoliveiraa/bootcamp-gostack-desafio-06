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
      page: 1,
      laoding: false,
    };
  }

  async componentDidMount() {
    this.loadMore();
  }

  loadMore = async () => {
    const {page, stars, laoding} = this.state;
    const {route} = this.props;
    const {user} = route.params;

    if (laoding) return;

    this.setState({laoding: true});

    const response = await api.get(`/users/${user.login}/starred`, {
      params: {
        per_page: 5,
        page,
      },
    });

    this.setState({
      stars: [...stars, ...response.data],
      page: page + 1,
      laoding: false,
    });
  };

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
            onEndReached={this.loadMore}
            onEndReachedThreshold={0.2}
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
