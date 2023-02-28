import sequelize from '../config/db.js'
import {DataTypes} from 'sequelize'

const User = sequelize.define('user', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false},
  name: {type: DataTypes.STRING, allowNull: false},
  email: {type: DataTypes.STRING, unique: true, allowNull: false},
  password: {type: DataTypes.STRING, allowNull: false},
  role: {type: DataTypes.STRING, defaultValue: "USER"}
})

const Score = sequelize.define('score', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  totalScore: {type: DataTypes.INTEGER, allowNull: null},
  score: {type: DataTypes.STRING, allowNull: null},
  answersCorrectness: {type: DataTypes.STRING, allowNull: null},
})

const Test = sequelize.define('test', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const Question = sequelize.define('question', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  title: {type: DataTypes.STRING, allowNull: false},
  type: {type: DataTypes.STRING, allowNull: false},
  score: {type: DataTypes.INTEGER, allowNull: false}
})

const Variant = sequelize.define('variant', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  title: {type: DataTypes.STRING, allowNull: false},
  is_answer: {type: DataTypes.BOOLEAN, allowNull: false}
})

const Post = sequelize.define('post', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  title: {type: DataTypes.STRING, allowNull: false, unique: true},
  text: {type: DataTypes.TEXT, allowNull: false},
  authorId: {type: DataTypes.INTEGER, allowNull: false}
})

const PostSuggestedChanges = sequelize.define('post_suggested_change', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  text: {type: DataTypes.TEXT, allowNull: false},
  postId: {type: DataTypes.INTEGER, allowNull: false},
  userId: {type: DataTypes.INTEGER, allowNull: false},
  /*votesId: {type: DataTypes.INTEGER, allowNull: false}*/
})

const PostChangeHistory = sequelize.define('post_change_history', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  postId: {type: DataTypes.INTEGER, allowNull: false},
  title: {type: DataTypes.STRING, allowNull: false/*, unique: true*/},
  text: {type: DataTypes.TEXT, allowNull: false},
  authorId: {type: DataTypes.INTEGER, allowNull: false}
})

const PostChangeVote = sequelize.define('post_change_vote', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  /*postChangeHistoryId: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false},*/
  userId: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false},
  userVote: {type: DataTypes.BOOLEAN,  allowNull: false}
})

const PostComments = sequelize.define('post_comment', {
  id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  text: {type: DataTypes.STRING, allowNull: false},
  parentId: {type: DataTypes.INTEGER, allowNull: true}
})

User.hasMany(Score) // поля внешних ключей автоматически создаются в Score
Post.hasMany(PostSuggestedChanges)
PostSuggestedChanges.hasMany(PostChangeVote)
User.hasMany(PostChangeVote)

User.hasMany(PostComments)
PostComments.belongsTo(User)
Post.hasMany(PostComments)
PostComments.belongsTo(Post)

Test.hasMany(Score)

Test.hasMany(Question)

Question.hasMany(Variant)

Post.hasOne(Test)
Test.belongsTo(Post)

export  {
  User,
  Post,
  Score,
  Test,
  Question,
  Variant,
  PostChangeHistory,
  PostChangeVote,
  PostComments,
  PostSuggestedChanges
}