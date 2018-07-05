package com.mycompany.myapp.config;

import io.github.simlife.async.ExceptionHandlingAsyncTaskExecutor;
import io.github.simlife.config.SimlifeProperties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.aop.interceptor.AsyncUncaughtExceptionHandler;
import org.springframework.aop.interceptor.SimpleAsyncUncaughtExceptionHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.*;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@Configuration
@EnableAsync
@EnableScheduling
public class AsyncConfiguration implements AsyncConfigurer {

    private final Logger log = LoggerFactory.getLogger(AsyncConfiguration.class);

    private final SimlifeProperties simLifeProperties;

    public AsyncConfiguration(SimlifeProperties simLifeProperties) {
        this.simLifeProperties = simLifeProperties;
    }

    @Override
    @Bean(name = "taskExecutor")
    public Executor getAsyncExecutor() {
        log.debug("Creating Async Task Executor");
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(simLifeProperties.getAsync().getCorePoolSize());
        executor.setMaxPoolSize(simLifeProperties.getAsync().getMaxPoolSize());
        executor.setQueueCapacity(simLifeProperties.getAsync().getQueueCapacity());
        executor.setThreadNamePrefix("hallo-Executor-");
        return new ExceptionHandlingAsyncTaskExecutor(executor);
    }

    @Override
    public AsyncUncaughtExceptionHandler getAsyncUncaughtExceptionHandler() {
        return new SimpleAsyncUncaughtExceptionHandler();
    }
}
