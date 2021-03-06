package com.skylight.blog.service;

import com.skylight.blog.model.Friendlink;

import java.util.List;

public interface FriendLinkService {
    boolean addFriendLink(Friendlink FriendLink);

    boolean deleteFriendLink(int id);

    boolean updateFriendLink(Friendlink FriendLink);

    Friendlink getFriendLinkById(int id);

    List<Friendlink> getFriendLinkList(int isFamous);
}
