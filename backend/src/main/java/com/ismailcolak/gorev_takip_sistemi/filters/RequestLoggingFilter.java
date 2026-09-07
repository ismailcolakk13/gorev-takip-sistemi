package com.ismailcolak.gorev_takip_sistemi.filters;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RequestLoggingFilter implements Filter {
    private static final Logger logger = LoggerFactory.getLogger(RequestLoggingFilter.class);
    private static final Pattern MESSAGE_PATTERN = Pattern.compile("\"message\"\\s*:\\s*\"([^\"]*)\"");

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        ContentCachingResponseWrapper wrappedResponse = new ContentCachingResponseWrapper((HttpServletResponse) response);

        long startTime = System.currentTimeMillis();
        String method = httpRequest.getMethod();
        String uri = httpRequest.getRequestURI();

        logger.info("--> [GELEN ISTEK] {} {}", method, uri);

        try {
            chain.doFilter(request, wrappedResponse);
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            int status = wrappedResponse.getStatus();

            if (status >= 400) {
                String body = new String(wrappedResponse.getContentAsByteArray(), StandardCharsets.UTF_8);
                Matcher matcher = MESSAGE_PATTERN.matcher(body);
                String message = matcher.find() ? matcher.group(1) : body;
                logger.info("<-- [YANIT VERILDI] {} {} [Statü: {}] ({} ms) | {}", method, uri, status, duration, message);
            } else {
                logger.info("<-- [YANIT VERILDI] {} {} [Statü: {}] ({} ms)", method, uri, status, duration);
            }

            wrappedResponse.copyBodyToResponse();
        }
    }
}
