package com.skylight.blog.service.impl;

import com.skylight.blog.constant.RedisKeys;
import com.skylight.blog.mapper.ArticleInfoMapper;
import com.skylight.blog.mapper.CategoryMapper;
import com.skylight.blog.mapper.LabelMapper;
import com.skylight.blog.model.*;
import com.skylight.blog.service.ManageService;
import com.skylight.blog.utils.RedisUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ManageServiceImpl implements ManageService {

    @Autowired
    CategoryMapper categoryMapper;
    @Autowired
    LabelMapper labelMapper;
    @Autowired
    ArticleInfoMapper articleInfoMapper;

    @Autowired
    private RedisUtil redisUtil;

    // Category
    public boolean addCategory(String name){

        redisUtil.deleteRedisCacheByKey(RedisKeys.SITEINFO);
        redisUtil.deleteRedisCacheByKey(RedisKeys.CATEGORYLIST);

        Category category = new Category();
        category.setName(name);
        category.setNumber(0);
        return categoryMapper.addCategory(category);
    }

    public boolean deleteCategory(Long id){

        redisUtil.deleteRedisCacheByKey(RedisKeys.SITEINFO);
        redisUtil.deleteRedisCacheByKey(RedisKeys.CATEGORYLIST);

        return categoryMapper.deleteCategory(id);
    }

    public Category getCategoryById(Long id)
    {
        return categoryMapper.getCategoryById(id);
    }

    public boolean updateCategory(Category category)
    {
        redisUtil.deleteRedisCacheByKey(RedisKeys.CATEGORYLIST);
        return categoryMapper.updateCategory(category);
    }

    // Label
    public boolean addLabel(String name){

        redisUtil.deleteRedisCacheByKey(RedisKeys.SITEINFO);
        redisUtil.deleteRedisCacheByKey(RedisKeys.LABELLIST);

        Label label = new Label();
        label.setName(name);
        return labelMapper.addLabel(label);
    }

    public boolean deleteLabel(Long id){

        redisUtil.deleteRedisCacheByKey(RedisKeys.SITEINFO);
        redisUtil.deleteRedisCacheByKey(RedisKeys.LABELLIST);

        return labelMapper.deleteLabel(id);
    }

    public Label getLabelById(Long id){
        return labelMapper.getLabelById(id);
    }

    public boolean updateLabel(Label label){
        redisUtil.deleteRedisCacheByKey(RedisKeys.LABELLIST);
        return labelMapper.updateLabel(label);
    }

    // Article
    public boolean addArticle(ArticleInfo articleInfo, ArticleContent articleContent, Long[] ids){

        redisUtil.deleteRedisCacheByKey(RedisKeys.SITEINFO);
        redisUtil.deleteRedisCacheByKey(RedisKeys.ARTICLESUM);
        redisUtil.deleteRedisCacheByKeyPrefix(RedisKeys.ARTICLEINFOLISTPAGE);

        articleInfoMapper.addArticleInfo(articleInfo);
        if(articleInfo.getIsOriginal() == 1) {
            articleInfo.setAuthor("站长");
            articleInfo.setUrl("https://www.baidurex.com/article.html?id=" + articleInfo.getId());
            articleInfoMapper.updateArticleInfo(articleInfo);
        }

        articleContent.setArticleId(articleInfo.getId());
        articleInfoMapper.addArticleContent(articleContent);
        for (int i = 0; i < ids.length; i++) {
            ArticleLabel articleLabel = new ArticleLabel();
            articleLabel.setArticleId(articleInfo.getId());
            articleLabel.setLabelId(ids[i]);
            labelMapper.addArticleLabel(articleLabel);
        }
        return true;
    }

    public boolean deleteArticle(Long id)
    {
        redisUtil.deleteRedisCacheByKey(RedisKeys.SITEINFO);
        redisUtil.deleteRedisCacheByKey(RedisKeys.ARTICLESUM);
        redisUtil.deleteRedisCacheByKey(RedisKeys.ARTICLE + id);
        redisUtil.deleteRedisCacheByKeyPrefix(RedisKeys.ARTICLEINFOLISTPAGE);

        articleInfoMapper.deleteArticleContentByArticleInfoId(id);
        labelMapper.deleteArticleLabelByArticleInfoId(id);
        return articleInfoMapper.deleteArticleInfo(id);
    }

    public boolean updateArticle(ArticleInfo articleInfo, ArticleContent articleContent)
    {
        redisUtil.deleteRedisCacheByKey(RedisKeys.ARTICLE + articleInfo.getId());
        redisUtil.deleteRedisCacheByKeyPrefix(RedisKeys.ARTICLEINFOLISTPAGE);

        if(articleInfoMapper.updateArticleInfo(articleInfo)) {
        return articleInfoMapper.updateArticleContent(articleContent);
        }
        else {
            return false;
        }
    }

    // ArticleLabel
    public boolean addLabelByArticleId(Long articleId,Long labelId)
    {
        ArticleLabel articleLabel = new ArticleLabel();
        articleLabel.setArticleId(articleId);
        articleLabel.setLabelId(labelId);
        return labelMapper.addArticleLabel(articleLabel);
    }

    public boolean deleteArticleLabel(Long id)
    {
        return labelMapper.deleteArticleLabel(id);
    }
}
