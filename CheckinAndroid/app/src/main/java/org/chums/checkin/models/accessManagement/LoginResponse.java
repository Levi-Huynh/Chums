package org.chums.checkin.models;

public class LoginResponse {
    private User user;
    private Churches churches;
    private String token;

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Churches getChurches() {
        return churches;
    }

    public void setChurches(Churches churches) {
        this.churches = churches;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
