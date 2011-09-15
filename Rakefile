require 'smart_asset'
require 'fileutils'

task :default => [:all]

task :all => [:css, :js] do
end

task :js do
  puts "compressing js"
  SmartAsset.load_config Dir.pwd, 'assets.yml'
  SmartAsset.compress 'javascripts'
  Dir["#{Dir.pwd}/theme/javascripts/temp/*.js"].each do |filename|
    target_filename = filename.sub(/\/temp\/.*_/, '/')
    puts "Moving to #{target_filename}"
    FileUtils.move filename, filename.sub(/\/temp\/.*_/, '/')
  end
  puts "Removing temp folder"
  Dir.delete "#{Dir.pwd}/theme/javascripts/temp"
end

task :css do
  File.delete "#{Dir.pwd}/theme/stylesheets/theme.css"
  puts "compressing css"
  puts `compass compile`
end

task :deploy => [:all, :upload]

task :upload  do
  # be sure to have exported these keys
  # export AWS_ACCESS_KEY_ID=yourS3accesskey
  # export AWS_SECRET_ACCESS_KEY=yourS3secretkey
  ['samples','theme'].each do |folder|
    puts %x[s3sync -v --public-read --recursive --exclude="\.DS_Store|sass|javascripts/source" --delete #{folder}/ theme.instedd.org:#{folder}]
  end
end