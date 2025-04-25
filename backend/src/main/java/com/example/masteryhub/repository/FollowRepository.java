package com.example.masteryhub.repository;




import com.example.masteryhub.models.Follow;
import com.example.masteryhub.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.Set;

public interface FollowRepository extends JpaRepository<Follow, Long> {

    Optional<Follow> findByFollowerAndFollowed(User follower, User followed);

    boolean existsByFollowerAndFollowed(User follower, User followed);

    @Query("SELECT f.follower FROM Follow f WHERE f.followed.id = :followedId")
    Set<User> findFollowersByFollowedId(@Param("followedId") Long followedId);

    @Query("SELECT f.followed FROM Follow f WHERE f.follower.id = :followerId")
    Set<User> findFollowingByFollowerId(@Param("followerId") Long followerId);
}
